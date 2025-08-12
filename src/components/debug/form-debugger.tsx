"use client"

import { useEffect } from "react"

export default function FormDebugger() {
  useEffect(() => {
    // Debug form submission
    const forms = document.querySelectorAll('form')
    
    forms.forEach((form, index) => {
      console.log(`Form ${index}:`, form)
      
      form.addEventListener('submit', (e) => {
        console.log('Form submission intercepted!')
        
        // Get all form data
        const formData = new FormData(form)
        const formObject: Record<string, any> = {}
        
        for (let [key, value] of formData.entries()) {
          formObject[key] = value
        }
        
        console.log('FormData:', formObject)
        
        // Get all input values directly
        const inputs = form.querySelectorAll('input, select, textarea')
        const directValues: Record<string, any> = {}
        
        inputs.forEach((input: any) => {
          if (input.name) {
            if (input.type === 'checkbox') {
              directValues[input.name] = input.checked
            } else {
              directValues[input.name] = input.value
            }
          }
        })
        
        console.log('Direct input values:', directValues)
        
        // Check for missing fields
        const expectedFields = ['name', 'email', 'password', 'confirmPassword', 'position', 'agreeToTerms', 'agreeToPrivacy']
        const missingFields = expectedFields.filter(field => !(field in directValues))
        
        if (missingFields.length > 0) {
          console.error('Missing fields:', missingFields)
        }
        
        console.log('Form validation state:')
        inputs.forEach((input: any) => {
          if (input.name) {
            console.log(`${input.name}:`, {
              value: input.value,
              validity: input.validity,
              validationMessage: input.validationMessage
            })
          }
        })
      })
    })
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
      Form Debug Active (Check Console)
    </div>
  )
}
