"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContactContent, ThemeOptions } from "@/lib/wordpress.d";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactContent?: ContactContent; // Por ahora any, después lo tipamos correctamente
  themeOptions?: ThemeOptions; // Para acceder a cta_form_id
}

const ContactDialog = ({ open, onOpenChange, contactContent, themeOptions }: ContactDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(1);
      setFormData({});
      setErrors({});
    }
  }, [open]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    const currentStepConfig = getCurrentStepConfig();
    const stepErrors: Record<string, string> = {};
    
    currentStepConfig.fields.forEach(field => {
      if (field.required && !formData[field.id]?.trim()) {
        stepErrors[field.id] = `${field.label} is required`;
      }
      
      if (field.type === 'email' && formData[field.id] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[field.id])) {
        stepErrors[field.id] = 'Please enter a valid email address';
      }
    });
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const getTotalSteps = () => {
    if (!contactContent?.contact_forms?.enabled || !contactContent.contact_forms.forms) {
      return 0;
    }
    
    // Buscar el formulario específico usando cta_form_id de ThemeOptions
    const formId = themeOptions?.general?.cta_form_id;
    let targetForm;
    
    if (formId) {
      // Buscar por ID específico
      targetForm = contactContent.contact_forms.forms.find(f => f.id === formId && f.active);
    }
    
    // Si no se encuentra por ID específico, usar el primer formulario activo
    if (!targetForm) {
      targetForm = contactContent.contact_forms.forms.find(f => f.active);
    }
    
    return targetForm ? targetForm.steps.length : 0;
  };

  const nextStep = () => {
    console.log('Next button clicked. Current step:', currentStep, 'Total steps:', getTotalSteps());
    
    if (validateCurrentStep() && currentStep < getTotalSteps()) {
      console.log('Validation passed, moving to next step');
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Validation failed or already at last step');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateCurrentStep()) {
      // Obtener el ID del formulario actual
      const formId = themeOptions?.general?.cta_form_id || 'default-form';
      
      try {
        const response = await fetch('/api/leads/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formId,
            formData
          }),
        });

        const result = await response.json();

        if (result.success) {
          console.log('Lead enviado exitosamente:', result);
          
          // Cerrar dialog y resetear formulario
          onOpenChange(false);
          setFormData({});
          setErrors({});
          setCurrentStep(1);
        } else {
          console.error('Error enviando lead:', result.message);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      } catch (error) {
        console.error('Error en la submission:', error);
        // Manejar errores de red o otros errores
      }
    }
  };

  const getCurrentStepConfig = () => {
    if (!contactContent?.contact_forms?.enabled || !contactContent.contact_forms.forms) {
      return { title: "Form Not Available", subtitle: "Contact form is not configured", fields: [] };
    }

    // Buscar el formulario específico usando cta_form_id de ThemeOptions
    const formId = themeOptions?.general?.cta_form_id;
    let targetForm;
    
    if (formId) {
      // Buscar por ID específico
      targetForm = contactContent.contact_forms.forms.find(f => f.id === formId && f.active);
    }
    
    // Si no se encuentra por ID específico, usar el primer formulario activo
    if (!targetForm) {
      targetForm = contactContent.contact_forms.forms.find(f => f.active);
    }
    
    if (!targetForm) {
      return { title: "Form Not Available", subtitle: "No active forms found", fields: [] };
    }

    const currentStepData = targetForm.steps[currentStep - 1];
    
    if (!currentStepData) {
      return { title: "Step Not Found", subtitle: "This step is not configured", fields: [] };
    }

    return {
      title: currentStepData.title,
      subtitle: currentStepData.subtitle,
      fields: currentStepData.fields
    };
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={errors[field.id] ? "border-red-500" : ""}
            />
            {errors[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        );
      
      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={errors[field.id] ? "border-red-500" : ""}
              rows={3}
            />
            {errors[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        );
      
      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Select value={formData[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
              <SelectTrigger className={errors[field.id] ? "border-red-500" : ""}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        );
      
      case 'radio':
        return (
          <div key={field.id} className="space-y-3">
            <Label>{field.label}</Label>
            <div className="grid grid-cols-1 gap-3">
              {field.options?.map((option: any) => (
                <Card 
                  key={option.value} 
                  className={`cursor-pointer transition-all ${
                    formData[field.id] === option.value 
                      ? "ring-2 ring-primary bg-primary/5" 
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleInputChange(field.id, option.value)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData[field.id] === option.value 
                          ? "border-primary bg-primary" 
                          : "border-muted-foreground"
                      }`}>
                        {formData[field.id] === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                      <span className="text-sm">{option.label}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {errors[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        );
      
      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.id}
              checked={formData[field.id] === "true"}
              onChange={(e) => handleInputChange(field.id, e.target.checked ? "true" : "false")}
              className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <Label htmlFor={field.id} className="text-sm">{field.label}</Label>
          </div>
        );
      
      default:
        return null;
    }
  };

  const currentStepConfig = getCurrentStepConfig();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {contactContent?.contact_forms?.forms?.find(f => f.active)?.title || "Get Started Today"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Step {currentStep} of {getTotalSteps()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-6">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
            />
          </div>
          
          {/* Step Content */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{currentStepConfig.title}</h3>
              <p className="text-muted-foreground">{currentStepConfig.subtitle}</p>
            </div>
            
            <div className="space-y-4">
              {currentStepConfig.fields.map(renderField)}
            </div>
          </div>
          
          {/* Navigation Buttons - Moved outside form to prevent form submission issues */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            {currentStep < getTotalSteps() ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <form onSubmit={handleSubmit} className="inline">
                <Button type="submit" className="flex items-center gap-2">
                  {contactContent?.contact_forms?.forms?.find(f => f.active)?.settings?.submitText || "Get Started Today"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
