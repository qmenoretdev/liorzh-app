<template>
  <div :class="getCssClass.container.default + ' col-12'">
    <div class="grid">
      <SpecyForm
        :class="getFormClass"
        :formError="formErrorSpecy"
        v-model:botanicalName="variety.specy.botanicalName"
        v-model:frenchCommonNames="frenchCommonNames"
        v-model:upovCode="variety.specy.upovCode"
        v-model:isPublicSpecy="isPublicSpecy"
        :readonly="isUpdateMode"
      />
      <div v-if="!isUpdateMode" class="col-6">
        <div>
          <h3>Recherche d'espèce</h3>
          <SearchSpecy
            class="col-12 mb-2"
            v-model:botanicalName="searchSpecy.botanicalName"
            v-model:frenchCommonName="searchSpecy.frenchCommonName"
            v-model:validityValues="searchSpecyFilter.validityValues"
            v-model:onAllSpecies="searchSpecyFilter.onAllSpecies"
            @submit="searchSpecies"
          />
          <Button class="col-12" icon="pi pi-search" @click="searchSpecies"
            >Rechercher</Button
          >
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
          <Column field="valid" header="Validée ?"
            ><template #body="slotProps">
              {{ showValidity(slotProps.data.valid) }}
            </template></Column
          >
          <Column>
            <template #body="slotProps">
              <Button
                icon="pi pi-plus-circle"
                text
                raised
                rounded
                @click="selectSpecy(slotProps.data)"
                title="Sélectionner cette espèce"
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
        <div class="field grid" v-if="isPublicSpecy">
          <label for="isPublicVariety" class="col-12 sm:col-3"
            >Public&nbsp;
            <div
              class="pi pi-question-circle"
              v-tooltip="
                'Une variété publique est partagée avec les autres utilisateurs. Une variété publique ne peut être modifiée que par un Administrateur.'
              "
            ></div
          ></label>
          <div class="col-12 sm:col-8">
            <Checkbox
              id="isPublicVariety"
              v-model="isPublicVariety"
              :binary="true"
              :disabled="varietyToUpdate.id !== 0"
            >
            </Checkbox>
          </div>
        </div>
      </div>
      <div
        v-if="proposedVariety.id !== 0"
        :class="getCssClass.container.default + ' col-12 md:col-6 mt-1'"
      >
        <div class="col-12 mb-2">
          <VarietyDetails :variety="proposedVariety" />
        </div>
        <Button
          rounded
          icon="pi pi-plus-circle"
          label="Ajouter la variété existante"
          @click="addVarietyToProject()"
          class="col-12 md:col-6"
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
        class="col-5 md:col-4 md:col-offset-2 mr-2"
        :loading="loading"
      />
      <Button
        rounded
        :label="$t('button.cancel')"
        @click="quit()"
        class="col-5 md:col-4"
        severity="secondary"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FormCommon from "@/components/common/FormCommon.vue";
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
import { getOwner } from "@/scripts/CommonScript";
import { PUBLIC } from "@/utils/constant";
import Checkbox from "primevue/checkbox";
import { VALIDITY, selectOptionsToValidity, showValidity } from "@/utils/validity";
import responseService from "@/services/ResponseService";
import toastService from "@/services/ToastService";
import type { ToastMessageOptions } from "primevue/toast";
import authorizationService from "@/services/AuthorizationService";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  extends: FormCommon,
  emits: ["addVarietyToProject"],
  components: {
    Button,
    InlineMessage,
    FormMessage,
    SpecyForm,
    SearchSpecy,
    VarietyDetails,
    DataTable,
    Column,
    LoadingSpinner,
    Checkbox,
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
      isPublicSpecy: true,
      isPublicVariety: true,
      searchSpecyFilter: {
        onAllSpecies: false,
        validityValues: [VALIDITY.TRUE],
      },
    };
  },
  watch: {
    varietyToUpdate(newVarietyToUpdate) {
      this.variety = newVarietyToUpdate;
      if (this.variety !== null) {
        this.frenchCommonNames = specyService.commonNamesArrayToString(
          this.variety.specy.frenchCommonNames
        );
        this.isPublicVariety = newVarietyToUpdate.owner === PUBLIC;
        this.isPublicSpecy = newVarietyToUpdate.specy.owner === PUBLIC;
      }
    },
  },
  computed: {
    getCssClass() {
      return cssClass;
    },
    getFormClass() {
      return "col-12" + (this.isUpdateMode ? "" : " md:col-6");
    },
    isUpdateMode(): boolean {
      return this.varietyToUpdate && this.varietyToUpdate.id !== 0;
    },
    publicOwner(): string {
      return PUBLIC;
    },
  },
  methods: {
    submit() {
      if (this.checkForm()) {
        this.variety.specy.frenchCommonNames = specyService.stringCommonNamesToArray(
          this.frenchCommonNames
        );
        this.variety.specy.owner = getOwner(this.isPublicSpecy);
        this.variety.owner = getOwner(this.isPublicSpecy && this.isPublicVariety);
        const userStore = useUserStore();
        this.variety.projects = [userStore.activeProjectUser.project];
        this.$emit("submit", this.variety);
      }
    },
    async searchSpecies() {
      this.loadingSearchStep = 1;
      this.searchSpecy.owner = this.searchSpecyFilter.onAllSpecies ? null : PUBLIC;
      this.searchSpecy.validity = selectOptionsToValidity(
        this.searchSpecyFilter.validityValues
      );
      try {
        this.searchedSpecies = await specyService.searchSpecies(this.searchSpecy);
      } catch (error: any) {
        const toastOptions = toastService.getToastOptions(
          "Erreur lors de la recherche des espèces",
          responseService.getApiErrors(error)
        );
        toastOptions.forEach((toastOption: ToastMessageOptions) => {
          this.$toast.add(toastOption);
        });
      }
      this.loadingSearchStep = 2;
    },
    addVarietyToProject() {
      this.$emit("addVarietyToProject", this.proposedVariety);
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
      this.isPublicSpecy = specy.owner === PUBLIC;
      this.frenchCommonNames = specyService.commonNamesArrayToString(
        specy.frenchCommonNames
      );
    },
    showValidity(valid: string) {
      return showValidity(valid);
    },
    isAdmin(): boolean {
      return authorizationService.isAdmin();
    },
  },
});
</script>
