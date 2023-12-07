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
    <SelectButton
      v-model="visibilityValuesData"
      @change="$emit('update:visibilityValues', $event.value)"
      :options="visibilityOptions"
      optionLabel="name"
      multiple
      aria-labelledby="multiple"
      class="mb-1"
    />
  </div>
</template>

<script setup lang="ts">
import { cssClass } from "@/utils/style";
import SelectButton from "primevue/selectbutton";
import { visibilityOptions } from "@/models/Visibility";
import { ref } from "vue";

const emit = defineEmits([
  "submit",
  "update:botanicalName",
  "update:frenchCommonNames",
  "update:visibilityValues",
]);
const props = defineProps({
  botanicalName: {
    default: "",
  },
  frenchCommonName: {
    default: "",
  },
  visibilityValues: {
    default: [],
  },
});

const visibilityValuesData = ref(props.visibilityValues);

async function submit() {
  emit("submit");
}
</script>
