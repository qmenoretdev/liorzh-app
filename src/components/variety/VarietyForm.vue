<template>
  <div>
    <Dialog
      :header="header"
      v-model:visible="visibleData"
      modal
      :style="{ width: isUpdateMode ? '45vw' : '90vw' }"
      @update:visible="closeModal"
    >
      <div class="grid">
        <SpecyForm
          :class="getFormClass"
          :formError="formErrorSpecy"
          v-model:botanicalName="variety.specy.botanicalName"
          v-model:frenchCommonNames="frenchCommonNames"
          v-model:upovCode="variety.specy.upovCode"
          :readonly="isUpdateMode"
        />
        <div v-if="!isUpdateMode">
          <div>
            <h3 class="public-object-text">Recherche d'espèce</h3>
            <SearchSpecy
              class="col-12"
              v-model:botanicalName="searchSpecy.botanicalName"
              v-model:frenchCommonName="searchSpecy.frenchCommonName"
              v-model:visibilityValues="visibilityValues"
              @submit="searchSpecies"
            />
          </div>
          <LoadingSpinner v-if="loadingSearchStep == 1" />
          <DataTable
            v-if="loadingSearchStep == 2 && searchedSpecies.length > 0"
            :value="searchedSpecies"
            scrollable
            scrollHeight="300px"
            dataKey="id"
          >
            <Column field="botanicalName" header="Nom botanique">
              <template #body="slotProps">
                <i>{{ slotProps.data.botanicalName }}</i>
              </template>
            </Column>
            <Column field="frenchCommonNames" header="Nom(s) commun(s)">
              <template #body="slotProps">
                {{ commonNamesArrayToString(slotProps.data.frenchCommonNames) }}
              </template>
            </Column>
            <Column field="upovCode" header="Code UPOV" />
            <Column field="visibility" header="Visibilité" />
            <Column>
              <template #body="slotProps">
                <Button
                  icon="pi pi-plus-circle"
                  text
                  raised
                  rounded
                  @click="selectSpecy(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
          <div v-else-if="loadingSearchStep == 2 && searchedSpecies.length == 0">
            <InlineMessage class="col-12 mb-1" severity="info"
              >Aucun résultat</InlineMessage
            >
          </div>
        </div>
      </div>
      <div class="grid mb-2">
        <div :class="getCssClass.container.default + ' ' + getFormClass">
          <h3 style="margin-top: -5px">Variété</h3>
          <div class="field grid">
            <label for="name" class="col-12 sm:col-3 mb-0">Nom de la variété</label>
            <div class="col-12 sm:col-8">
              <input
                id="name"
                placeholder="Chioggia"
                type="text"
                :class="getInputClass(formError.nameError)"
                v-model="variety.name"
                @keyup.enter="submit()"
                maxlength="128"
              />
            </div>
            <FormMessage class="col-12" :message="formError.nameError" />
          </div>
          <div class="field grid">
            <label for="name" class="col-12 sm:col-3">Description</label>
            <div class="col-12 sm:col-8">
              <textarea
                id="description"
                placeholder="La Betterave de Chioggia est une variété ancienne italienne très hâtive à racine ronde et à la chair sucrée, rose veinée de blanc."
                type="text"
                :class="getCssClass.input.default"
                v-model="variety.description"
              />
            </div>
          </div>
        </div>
        <div
          v-if="proposedVariety.id !== 0"
          :class="getCssClass.container.default + ' col-12 md:col-6 mt-1'"
        >
          <div>
            <VarietyDetails :variety="proposedVariety" />
          </div>
          <Button
            rounded
            icon="pi pi-plus-circle"
            label="Ajouter la variété existante"
            @click="addUserToVariety()"
            :class="'col-12 md:col-6 button-create'"
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
          :class="
            'col-4 md:col-3 col-offset-4' +
            (varietyToUpdate.id === 0 ? ' button-create' : '')
          "
          :loading="loading"
        />
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ModalFormCommon from "@/components/common/ModalFormCommon.vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InlineMessage from "primevue/inlinemessage";
import { cssClass, getInputClass } from "@/utils/style";
import varietyScript from "@/scripts/VarietyScript";
import FormMessage from "@/components/common/FormMessage.vue";
import SpecyForm from "@/components/specy/SpecyForm.vue";
import SearchSpecy from "@/components/specy/SearchSpecy.vue";
import specyService from "@/services/SpecyService";
import specyScript from "@/scripts/SpecyScript";
import type { Variety } from "@/models/Variety";
import VarietyDetails from "@/components/variety/VarietyDetails.vue";
import type { Specy } from "@/models/Specy";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import { publicOption, visibilityOptions } from "@/models/Visibility";

export default defineComponent({
  extends: ModalFormCommon,
  emits: ["addUserToVariety", "submit"],
  components: {
    Dialog,
    Button,
    InlineMessage,
    FormMessage,
    SpecyForm,
    SearchSpecy,
    VarietyDetails,
    DataTable,
    Column,
    LoadingSpinner,
  },
  props: {
    varietyToUpdate: {
      default: varietyScript.init() as Variety,
    },
    proposedVariety: {
      default: varietyScript.init() as Variety,
    },
  },
  data() {
    return {
      variety: varietyScript.init(),
      searchedSpecies: [] as Specy[],
      searchSpecy: specyScript.initSearch(),
      frenchCommonNames: "",
      formError: this.initFormError(),
      formErrorSpecy: specyScript.initFormError(),
      loadingSearchStep: 0,
      visibilityValues: [publicOption],
    };
  },
  watch: {
    varietyToUpdate(newVarietyToUpdate) {
      this.variety = newVarietyToUpdate;
      if (this.variety !== null) {
        this.frenchCommonNames = specyService.commonNamesArrayToString(
          this.variety.specy.frenchCommonNames
        );
      }
    },
  },
  computed: {
    getCssClass() {
      return cssClass;
    },
    getVisibilityOptions() {
      return visibilityOptions;
    },
    getFormClass() {
      return "col-12" + (this.isUpdateMode ? "" : " md:col-6");
    },
    isUpdateMode(): boolean {
      return this.varietyToUpdate && this.varietyToUpdate.id !== 0;
    },
  },
  methods: {
    submit() {
      if (this.checkForm()) {
        this.variety.specy.frenchCommonNames = specyService.stringCommonNamesToArray(
          this.frenchCommonNames
        );
        this.$emit("submit", this.variety);
      }
    },
    async searchSpecies() {
      this.loadingSearchStep = 1;
      this.searchSpecy.visibility =
        this.visibilityValues.length == 1 ? this.visibilityValues[0].value : null;
      this.searchedSpecies = await specyService.searchSpecies(this.searchSpecy);
      this.loadingSearchStep = 2;
    },
    addUserToVariety() {
      this.$emit("addUserToVariety", this.proposedVariety);
    },
    getInputClass(error: string): string {
      return getInputClass(error);
    },
    checkForm() {
      this.formErrorSpecy = specyService.checkForm(this.variety.specy);
      let checkOk = this.formErrorSpecy.valid;
      this.formError = this.initFormError();
      if (this.variety.name === "" || this.variety.name == undefined) {
        this.formError.nameError = "Le nom de la variété est obligatoire";
        checkOk = false;
      }
      return checkOk;
    },
    initFormError(): object {
      return {
        nameError: "",
      };
    },
    commonNamesArrayToString(frenchCommonNames: string[]): string {
      return specyService.commonNamesArrayToString(frenchCommonNames);
    },
    selectSpecy(specy: Specy) {
      this.variety.specy = specy;
      this.frenchCommonNames = specyService.commonNamesArrayToString(
        specy.frenchCommonNames
      );
    },
  },
});
</script>
