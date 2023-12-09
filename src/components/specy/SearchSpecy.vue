<template>
  <div class="col-12">
    <div class="field grid mb-2">
      <label for="name" class="col-12 sm:col-3">Nom Botanique</label>
      <div class="col-12 sm:col-6">
        <input
          id="name"
          placeholder="Beta vulgaris"
          type="text"
          :class="cssClass.input.default"
          :value="botanicalName"
          @input="$emit('update:botanicalName', $event.target.value)"
          @keyup.enter="submit()"
          maxlength="128"
        />
      </div>
    </div>
    <div class="field grid">
      <label for="name" class="col-12 sm:col-3">Nom(s) commun(s)</label>
      <div class="col-12 sm:col-6">
        <input
          id="name"
          placeholder="Betterave"
          type="text"
          :class="cssClass.input.default"
          :value="frenchCommonName"
          @input="$emit('update:frenchCommonName', $event.target.value)"
          @keyup.enter="submit()"
          maxlength="128"
        />
      </div>
    </div>
    <div class="field grid">
      <label for="onlyValid" class="col-12 sm:col-3"
        >Espèce Valide ?</label>
      <div class="col-12 sm:col-8">
        <SelectButton
          v-model="validityValuesData"
          @change="$emit('update:validityValues', $event.value)"
          :options="validityOptions"
          optionLabel="name"
          multiple
          aria-labelledby="multiple"
          class="mb-1"
        />
      </div>
    </div>
    <div class="field grid" v-if="authorizationService.isAdmin()">
      <label for="onAllSpecies" class="col-12 sm:col-3"
        >Toutes les espèces ?</label>
      <div class="col-12 sm:col-8">
        <Checkbox id="onAllSpecies"
          v-model="onAllSpeciesData"
          :binary="true"
          @input="$emit('update:onAllSpecies', $event)">
        </Checkbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cssClass } from "@/utils/style";
import authorizationService from "@/services/AuthorizationService";
import Checkbox from "primevue/checkbox";
import { ref } from "vue";
import SelectButton from "primevue/selectbutton";
import { validityOptions } from "@/utils/validity";

const emit = defineEmits([
  "submit",
  "update:botanicalName",
  "update:frenchCommonNames",
  "update:onAllSpecies",
  "update:validityValues",
]);
const props = defineProps({
  botanicalName: {
    default: "",
  },
  frenchCommonName: {
    default: "",
  },
  onAllSpecies: {
    default: false,
  },
  validityValues: {
    default: [],
  }
});

const onAllSpeciesData = ref(props.onAllSpecies !== undefined ? props.onAllSpecies : false);
const validityValuesData = ref(props.validityValues);

async function submit() {
  emit("submit");
}
</script>
