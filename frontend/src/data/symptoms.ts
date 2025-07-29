export interface Symptom {
    id: string;
    name: string;
    categories: string[];
    bodyParts?: string[];
  }
  

 export interface BodyRegion {
    id: string;
    name: string;
    symptoms: string[];
  }
  
export  interface SymptomCategory {
    id: string;
    name: string;
    symptoms: string[];
  }
  
   export const allSymptoms: Symptom[] = [
      // Head and Face
      { id: '1', name: 'Headache', categories: ['Neurological', 'Pain'], bodyParts: ['Head'] },
      { id: '2', name: 'Dizziness', categories: ['Neurological', 'Balance'], bodyParts: ['Head']
         },
      { id: '3', name: 'Facial Pain', categories: ['Pain'], bodyParts: ['Face'] },
      { id: '4', name: 'Blurred Vision',  categories: ['Vision', 'Neurological'], bodyParts: ['Eyes'] },
      { id: '5', name: 'Ringing in Ears',  categories: ['Hearing', 'Neurological'], bodyParts: ['Ears'] },
      
      // Chest and Respiratory
      { id: '6', name: 'Chest Pain',  categories: ['Pain', 'Cardiovascular', 'Respiratory'], bodyParts: ['Chest'] },
      { id: '7', name: 'Shortness of Breath', categories: ['Respiratory'], bodyParts: ['Chest', 'Lungs'] },
      { id: '8', name: 'Cough',  categories: ['Respiratory', 'Infection'], bodyParts: ['Chest', 'Throat'] },
      { id: '9', name: 'Heart Palpitations', categories: ['Cardiovascular'], bodyParts: ['Chest'] },
      
      // Abdominal
      { id: '10', name: 'Abdominal Pain',  categories: ['Pain', 'Digestive'], bodyParts: ['Abdomen'] },
      { id: '11', name: 'Nausea',  categories: ['Digestive'], bodyParts: ['Abdomen', 'Stomach'] },
      { id: '12', name: 'Vomiting',  categories: ['Digestive', 'Infection'], bodyParts: ['Abdomen', 'Stomach'] },
      { id: '13', name: 'Diarrhea',  categories: ['Digestive', 'Infection'], bodyParts: ['Abdomen', 'Intestines']},
      
      // General/Systemic
      { id: '14', name: 'Fever',  categories: ['Infection', 'Inflammatory'], bodyParts: [] },
      { id: '15', name: 'Fatigue',  categories: ['General', 'Neurological'], bodyParts: [] },
      { id: '16', name: 'Chills',  categories: ['Infection', 'Inflammatory'], bodyParts: [] },
      { id: '17', name: 'Muscle Aches',  categories: ['Pain', 'Musculoskeletal'], bodyParts: ['Arms', 'Legs', 'Back'] },
      
      // Extremities
      { id: '18', name: 'Joint Pain',  categories: ['Pain', 'Musculoskeletal', 'Inflammatory'], bodyParts: ['Arms', 'Legs', 'Hands', 'Feet'] },
      { id: '19', name: 'Swelling',  categories: ['Inflammatory', 'Cardiovascular'], bodyParts: ['Arms', 'Legs', 'Hands', 'Feet', 'Face']},
      { id: '20', name: 'Numbness',  categories: ['Neurological'], bodyParts: ['Arms', 'Legs', 'Hands', 'Feet', 'Face'] },
      
      // Skin
      { id: '21', name: 'Rash',  categories: ['Skin', 'Allergic', 'Inflammatory', 'Infection'], bodyParts: [] },
      { id: '22', name: 'Itching',  categories: ['Skin', 'Allergic'], bodyParts: []},
      //General/Cardiovascular
      { id: '23', name: 'Low Blood Pressure',  categories: ['General', 'Cardiovascular'], bodyParts: []},
      { id: '24', name: 'High Blood Pressure',  categories: ['General', 'Cardiovascular'], bodyParts: []},
      { id: '25', name: 'Low Blood Sugar',  categories: ['General'], bodyParts: []},
      { id: '26', name: 'High Blood Sugar',  categories: ['General'], bodyParts: []},
    ];
  
   export const bodyRegions: BodyRegion[] = [
      { id: 'head', name: 'Head & Face', symptoms: ['Headache', 'Dizziness', 'Facial Pain', 'Blurred Vision', 'Ringing in Ears'] },
      { id: 'chest', name: 'Chest & Respiratory', symptoms: ['Chest Pain', 'Shortness of Breath', 'Cough', 'Heart Palpitations'] },
      { id: 'abdomen', name: 'Abdomen & Digestive', symptoms: ['Abdominal Pain', 'Nausea', 'Vomiting', 'Diarrhea'] },
      { id: 'extremities', name: 'Arms & Legs', symptoms: ['Joint Pain', 'Swelling', 'Numbness', 'Muscle Aches'] },
      { id: 'skin', name: 'Skin', symptoms: ['Rash', 'Itching'] },
      { id: 'general', name: 'General', symptoms: ['Low Blood Pressure', 'High Blood Pressure', 'Low Blood Sugar', 'High Blood Sugar', 'Fever', 'Fatigue', 'Chills'] },
    ];
  
    export const symptomCategories: SymptomCategory[] = [
      { id: 'pain', name: 'Pain & Discomfort', symptoms: ['Headache', 'Chest Pain', 'Abdominal Pain', 'Joint Pain', 'Facial Pain', 'Muscle Aches'] },
      { id: 'respiratory', name: 'Breathing & Respiratory', symptoms: ['Shortness of Breath', 'Cough'] },
      { id: 'digestive', name: 'Digestive Issues', symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain'] },
      { id: 'neurological', name: 'Neurological', symptoms: ['Headache', 'Dizziness', 'Blurred Vision', 'Numbness', 'Fatigue', 'Ringing in Ears'] },
      { id: 'general', name: 'General Symptoms', symptoms: ['Fever', 'Fatigue', 'Chills', 'Muscle Aches','Low Blood Pressure', 'High Blood Pressure', 'Low Blood Sugar', 'High Blood Sugar'] },
      { id: 'skin', name: 'Skin Issues', symptoms: ['Rash', 'Itching', 'Swelling'] },
    ];