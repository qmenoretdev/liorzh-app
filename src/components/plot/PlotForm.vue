<template>
  <div>
    <Dialog
      :header="header"
      v-model:visible="visibleData"
      modal
      :style="{ width: '50vw' }"
      @update:visible="closeModal"
    >
      <span
        >Utilisation des données de localisation
        <div
          class="pi pi-info-circle"
          v-tooltip="
            'Fournir aux utilisateurs une analyse globale par variété pour leur localisation. Aucune utilisation publicitaire.'
          "
        ></div
      ></span>
      <div :class="cssClass.container.default">
        <div class="field grid">
          <label for="name" class="col-12 sm:col-3"
            >Nom*&nbsp;
            <div
              class="pi pi-question-circle"
              v-tooltip="
                'Champ personnel pour nommer votre localisation. Pas utilisé dans l\'analyse globale.'
              "
            ></div
          ></label>
          <div class="col-12 sm:col-8">
            <input
              id="name"
              placeholder="Le super jardin"
              type="text"
              :class="getInputClass(formError.nameError)"
              v-model="plot.name"
              @keyup.enter="submit()"
            />
          </div>
          <FormMessage :message="formError.nameError" />
        </div>
        <div class="field grid">
          <label for="country" class="col-12 sm:col-3">Pays</label>
          <div class="col-12 sm:col-8">
            <select
              id="country"
              v-model="selectedCountry"
              :class="cssClass.input.default"
            >
              <option :value="null">-- Pas de pays sélectionné --</option>
              <option v-for="country in allCountries" :key="country[1]" :value="country">
                {{ country[0] }} ({{ country[1] }})
              </option>
            </select>
          </div>
        </div>
        <template v-if="selectedCountry !== null">
          <div class="field grid">
            <label for="region" class="col-12 sm:col-3">Région</label>
            <div class="col-12 sm:col-8">
              <select id="region" v-model="plot.region" :class="cssClass.input.default">
                <option :value="null">-- Pas de région sélectionnée --</option>
                <option
                  v-for="region in selectedCountry[2]"
                  :key="region[1]"
                  :value="region[0]"
                >
                  {{ region[0] }} ({{ region[1] }})
                </option>
              </select>
            </div>
          </div>
          <div class="field grid">
            <label for="subRegion" class="col-12 sm:col-3">Département</label>
            <div class="col-12 sm:col-8">
              <input
                id="subRegion"
                placeholder="Finistère"
                type="text"
                :class="cssClass.input.default"
                v-model="plot.subRegion"
                @keyup.enter="submit()"
              />
            </div>
          </div>
          <div class="field grid">
            <label for="city" class="col-12 sm:col-3">Ville</label>
            <div class="col-12 sm:col-8">
              <input
                id="city"
                placeholder="Brest"
                type="text"
                :class="cssClass.input.default"
                v-model="plot.city"
                @keyup.enter="submit()"
              />
            </div>
          </div>
        </template>
        <div class="field grid">
          <label for="description" class="col-12 sm:col-3"
            >Description&nbsp;
            <div
              class="pi pi-question-circle"
              v-tooltip="
                'Champ personnel pour décrire votre localisation. Pas utilisé dans l\'analyse globale.'
              "
            ></div
          ></label>
          <div class="col-12 sm:col-8">
            <textarea
              id="description"
              placeholder="Un petit jardin très mignon près d'un ruisseau"
              type="text"
              :class="cssClass.input.default"
              v-model="plot.description"
            />
          </div>
        </div>
        <InlineMessage
          class="col-12 mb-1"
          v-for="apiError in apiErrors"
          :key="apiError"
          :severity="apiError.level"
          >{{ apiError.message }}</InlineMessage
        >
        <div class="col-12">
          <Button
            rounded
            :label="submitButtonLabel"
            @click="submit()"
            class="col-4 md:col-3 col-offset-4"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import InlineMessage from "primevue/inlinemessage";
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import { cssClass, getInputClass } from "@/utils/style";
import plotScript from "@/scripts/PlotScript";
import FormMessage from "@/components/common/FormMessage.vue";
import Button from "primevue/button";
import type { ApiError } from "@/models/ApiError";
import { allCountries, CountryData } from "country-region-data";

const plot = ref(plotScript.init());
const formError = ref(initFormError());
const visibleData = ref(false);
const selectedCountry = ref(null as null | CountryData);
const props = defineProps({
  visible: {
    default: false,
  },
  header: {
    default: "Nouvelle Localisation",
  },
  plotToUpdate: {
    default: plotScript.init(),
  },
  apiErrors: {
    default: [] as ApiError[],
  },
  submitButtonLabel: {
    default: "Créer",
  },
});
const emit = defineEmits(["close", "submit"]);
watch(
  () => props.visible,
  (newValue) => {
    visibleData.value = newValue;
  }
);
watch(
  () => props.plotToUpdate,
  (newValue) => {
    plot.value = newValue;
    selectedCountry.value =
      allCountries.find((country) => newValue.country === country[0]) || null;
  }
);
function closeModal() {
  emit("close");
}
async function submit() {
  if (checkForm()) {
    if (selectedCountry.value !== null) {
      plot.value.country = selectedCountry.value[0];
    } else {
      plot.value.region = null;
      plot.value.subRegion = null;
      plot.value.city = null;
    }
    emit("submit", plot.value);
  }
}
function checkForm() {
  formError.value = initFormError();
  let checkOk = true;
  if (plot.value.name === "" || plot.value.name == undefined) {
    formError.value.nameError = "Le nom est obligatoire";
    checkOk = false;
  }
  return checkOk;
}
function initFormError() {
  return {
    nameError: "",
  };
}
</script>