import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Variety } from '@/models/Variety';
import varietyScript from '@/scripts/VarietyScript';

export const useVarietyStore = defineStore('varietyStore', () => {
  const userVarieties = ref([] as Variety[]);
  const selectedVariety = ref(varietyScript.init());
  function setUserVarieties(varietiesValue: Variety[]) {
    userVarieties.value = varietiesValue;
  }
  function setSelectedVariety(varietyValue: Variety) {
    selectedVariety.value = varietyValue;
  }
  return { userVarieties, setUserVarieties, selectedVariety, setSelectedVariety }
})
