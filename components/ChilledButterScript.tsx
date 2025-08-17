"use client";

import { useEffect } from 'react';

interface ChilledButterScriptProps {
  scriptTag?: string;
  ctaType?: string;
}

export const ChilledButterScript = ({ scriptTag, ctaType }: ChilledButterScriptProps) => {
  useEffect(() => {
    console.log('ChilledButterScript useEffect triggered:', { ctaType, scriptTag: scriptTag?.substring(0, 100) });
    
    if (ctaType === 'chilled_butter_widget' && scriptTag) {
      try {
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = scriptTag;
        const scriptElement = tempDiv.querySelector('script');
        
        if (scriptElement) {
          console.log('Script element found:', scriptElement.outerHTML);
          
          // Create a new script element
          const script = document.createElement('script');
          
          // Copy all attributes from the parsed script element
          Array.from(scriptElement.attributes).forEach(attr => {
            script.setAttribute(attr.name, attr.value);
            console.log('Setting attribute:', attr.name, attr.value);
          });
          
          // Append to body (as recommended by ChilledButter)
          document.body.appendChild(script);
          console.log('Script appended to body successfully');
          
          // Function to bind buttons
          const bindButtons = () => {
            const btnClass = scriptElement.getAttribute('trigger-button-class');
            if (btnClass) {
              const buttons = document.getElementsByClassName(btnClass);
              console.log('Found buttons with class', btnClass, ':', buttons.length);
              
              Array.from(buttons).forEach((button) => {
                // Remove existing listeners to avoid duplicates
                button.removeEventListener('click', handleButtonClick);
                button.addEventListener('click', handleButtonClick);
              });
            }
          };
          
          // Button click handler
          const handleButtonClick = (e: Event) => {
            e.stopPropagation();
            console.log('Button clicked, opening widget...');
            const widget = document.getElementById('cb-widget');
            if (widget) {
              widget.classList.add('active');
            }
          };
          
          // Close widget functionality
          const closeWidget = () => {
            const widget = document.getElementById('cb-widget');
            if (widget) {
              widget.classList.remove('active');
            }
          };
          
          // Check if widget was created after a delay
          setTimeout(() => {
            const widget = document.getElementById('cb-widget');
            console.log('Widget element found:', !!widget);
            if (widget) {
              console.log('Widget HTML:', widget.outerHTML);
              // Widget exists, just bind buttons
              bindButtons();
            } else {
              console.log('Widget not found, creating manually...');
              // Create widget manually if it doesn't exist
              const company = scriptElement.getAttribute('company');
              const url = scriptElement.getAttribute('url');
              const baseUrl = `${url}/cal/embed/${company}`;
              
              document.body.insertAdjacentHTML(
                'beforeend',
                `<div id='cb-widget'><div id='cb-widget-close'><span>x</span></div><iframe id='widget-iframe' src='${baseUrl}' allowtransparency='true'></iframe></div>
                <style>
                  #cb-widget {
                    visibility: hidden;
                    opacity: 0;
                    transition: visibility 0.5s, opacity 0.5s linear;
                    width: 450px;
                    max-width: 100%;
                    height: 100%;
                    position: fixed;
                    left: 0;
                    top: 0;
                    overflow: auto;
                    box-shadow: 6px 6px 8px 0 rgba(47, 47, 47, 0.2);
                    z-index: 999999;
                    font-family: sans-serif;
                  }
                  #cb-widget.active {
                    opacity: 1;
                    visibility: visible;
                  }
                  #cb-widget iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                    position: absolute;
                    left: 0;
                    top: 0;
                    background-color: white;
                  }
                  #cb-widget-close {
                    width: 30px;
                    height: 30px;
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    z-index: 2;
                    border-radius: 50%;
                    background: rgba(0,0,0,0.35);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    cursor: pointer;
                    transition: background-color 0.3s;
                  }
                  #cb-widget-close:hover {
                    background: rgba(0,0,0,0.5);
                  }
                </style>`
              );
              
              // Bind buttons after creating widget
              bindButtons();
              
              // Add close event listeners
              document.getElementById('cb-widget')?.addEventListener('click', closeWidget);
              document.getElementById('cb-widget-close')?.addEventListener('click', closeWidget);
            }
          }, 2000); // 2 second delay
          
          // Set up continuous button binding for dynamically added elements
          const observer = new MutationObserver(() => {
            bindButtons();
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          
          // Cleanup function
          return () => {
            if (document.body.contains(script)) {
              document.body.removeChild(script);
            }
            observer.disconnect();
          };
        } else {
          console.log('No script element found in:', scriptTag);
        }
      } catch (error) {
        console.error('Error parsing Chilled Butter script tag:', error);
      }
    } else {
      console.log('Conditions not met:', { ctaType, hasScriptTag: !!scriptTag });
    }
  }, [scriptTag, ctaType]);

  return null;
};
