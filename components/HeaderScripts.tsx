"use client";

import { useEffect } from 'react';

interface HeaderScript {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

interface HeaderScriptsProps {
  headerScripts?: {
    scripts: HeaderScript[];
  };
}

export const HeaderScripts = ({ headerScripts }: HeaderScriptsProps) => {
  useEffect(() => {
    console.log('HeaderScripts useEffect triggered:', { 
      scriptCount: headerScripts?.scripts?.length || 0,
      activeScripts: headerScripts?.scripts?.filter(s => s.active).length || 0
    });
    
    if (headerScripts?.scripts && headerScripts.scripts.length > 0) {
      try {
        // Filter only active scripts
        const activeScripts = headerScripts.scripts.filter(script => script.active);
        
        console.log('Active scripts to inject:', activeScripts.length);
        
        activeScripts.forEach((scriptData) => {
          try {
            console.log('Processing script:', scriptData.name, scriptData.id);
            
            // Create a temporary div to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = scriptData.code;
            const scriptElement = tempDiv.querySelector('script');
            
            if (scriptElement) {
              console.log('Script element found for:', scriptData.name);
              
              // Check if script already exists to avoid duplicates
              const existingScript = document.getElementById(scriptData.id);
              if (existingScript) {
                console.log('Script already exists, skipping:', scriptData.id);
                return;
              }
              
              // Create a new script element
              const script = document.createElement('script');
              script.id = scriptData.id;
              
              // Copy all attributes from the parsed script element
              Array.from(scriptElement.attributes).forEach(attr => {
                script.setAttribute(attr.name, attr.value);
                console.log('Setting attribute:', attr.name, attr.value);
              });
              
              // Copy the inner content if it exists
              if (scriptElement.innerHTML) {
                script.innerHTML = scriptElement.innerHTML;
                console.log('Script has inline content');
              }
              
              // Append to head
              document.head.appendChild(script);
              console.log('Script appended to head successfully:', scriptData.name);
              
            } else {
              console.log('No script element found in:', scriptData.name);
            }
          } catch (scriptError) {
            console.error('Error processing individual script:', scriptData.name, scriptError);
          }
        });
        
        // Cleanup function
        return () => {
          console.log('HeaderScripts cleanup - removing scripts');
          activeScripts.forEach((scriptData) => {
            const script = document.getElementById(scriptData.id);
            if (script && document.head.contains(script)) {
              document.head.removeChild(script);
              console.log('Removed script:', scriptData.id);
            }
          });
        };
        
      } catch (error) {
        console.error('Error processing header scripts:', error);
      }
    } else {
      console.log('No header scripts to process');
    }
  }, [headerScripts]);

  return null;
};
