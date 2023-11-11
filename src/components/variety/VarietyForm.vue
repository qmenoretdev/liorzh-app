<template>
  <div>
    <Dialog
      :header="header"
      v-model:visible="visibleData"
      modal
      :style="{ width: '70vw' }"
      @update:visible="closeModal"
    >
      <div class="grid">
        <SpecyForm
          class="col-12 md:col-6"
          :formError="formErrorSpecy"
          v-model:botanicalName="variety.specy.botanicalName"
          v-model:frenchCommonNames="frenchCommonNames"
          v-model:upovCode="variety.specy.upovCode"
        />
        <SearchSpecy class="col-12 md:col-6" />
      </div>
      <div class="grid mb-2">
        <div :class="getCssClass.container.default + ' col-12 md:col-6'">
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
          :class="getCssClass.container.default + ' col-6 mt-1'"
        >
          <div class="col-12">
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
      frenchCommonNames: "",
      formError: this.initFormError(),
      formErrorSpecy: specyScript.initFormError(),
    };
  },
  watch: {
    varietyToUpdate(newVarietyToUpdate) {
      this.variety = newVarietyToUpdate;
      this.frenchCommonNames = specyService.commonNamesArrayToString(
        this.variety.specy.frenchCommonNames
      );
    },
  },
  computed: {
    getCssClass() {
      return cssClass;
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
  },
});
</script>
