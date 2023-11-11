<template>
  <div>
    <div :class="getCssClass.container.default">
      <h3 style="margin-top: -5px">Espèce</h3>
      <div class="field grid">
        <label for="botanicalName" class="col-12 sm:col-3 mb-0"
          >Nom Botanique*&nbsp;
          <div
            class="pi pi-question-circle"
            v-tooltip="'Nom scientifique de l\'espèce. Doit être unique.'"
          ></div
        ></label>
        <div class="col-12 sm:col-8">
          <input
            id="botanicalName"
            placeholder="Beta vulgaris"
            type="text"
            :class="getInputClass(formError.botanicalNameError)"
            maxlength="255"
            :value="botanicalName"
            @input="$emit('update:botanicalName', $event.target.value)"
          />
        </div>
        <FormMessage :message="formError.botanicalNameError" />
      </div>
      <div class="field grid">
        <label for="frenchCommonNames" class="col-12 sm:col-3"
          >Nom(s) commun(s) français&nbsp;
          <div
            class="pi pi-question-circle"
            v-tooltip="'Nom vernaculaire. Si plusieurs les séparer par une virgule.'"
          ></div
        ></label>
        <div class="col-12 sm:col-8">
          <input
            id="frenchCommonNames"
            placeholder="Betterave"
            type="text"
            :class="getCssClass.input.default"
            :value="frenchCommonNames"
            @input="$emit('update:frenchCommonNames', $event.target.value)"
            maxlength="255"
          />
        </div>
      </div>
      <div class="field grid">
        <label for="upovCode" class="col-12 sm:col-3"
          >Code UPOV&nbsp;
          <div
            class="pi pi-question-circle"
            v-tooltip="'Code UPOV : https://www.upov.int/genie/'"
          ></div
        ></label>
        <div class="col-12 sm:col-8">
          <input
            id="upovCode"
            placeholder="BETAA_VUL"
            type="text"
            :class="getCssClass.input.default"
            :value="upovCode"
            @input="$emit('update:upovCode', $event.target.value)"
            maxlength="32"
          />
        </div>
      </div>
    </div>
    <InlineMessage
      class="col-12 mb-1"
      v-for="apiError in apiErrors"
      :key="apiError"
      :severity="apiError.level"
      >{{ apiError.message }}</InlineMessage
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ModalFormCommon from "@/components/common/ModalFormCommon.vue";
import Button from "primevue/button";
import InlineMessage from "primevue/inlinemessage";
import { cssClass, getInputClass } from "@/utils/style";
import specyScript from "@/scripts/SpecyScript";
import FormMessage from "@/components/common/FormMessage.vue";
import type { Specy } from "@/models/Specy";
import type { FormErrorSpecy } from "@/models/form/FormErrorSpecy";

export default defineComponent({
  extends: ModalFormCommon,
  components: { Button, InlineMessage, FormMessage },
  emits: [
    "submit",
    "update:botanicalName",
    "update:frenchCommonNames",
    "update:upovCode",
  ],
  props: {
    botanicalName: {
      default: "",
    },
    frenchCommonNames: {
      default: "",
    },
    upovCode: {
      default: "",
    },
    formError: {
      default: specyScript.initFormError(),
    },
  },
  data() {
    return {
      specy: specyScript.init() as Specy,
    };
  },
  computed: {
    getCssClass() {
      return cssClass;
    },
  },
  methods: {
    submit() {
      if (this.checkForm()) {
        if (
          this.frenchCommonNames !== undefined &&
          this.frenchCommonNames.trim().replace(",", "") !== ""
        ) {
          const frenchCommonNamesSplit = this.frenchCommonNames.split(",");
          for (const commonName in frenchCommonNamesSplit) {
            this.specy.frenchCommonNames.push(commonName.trim());
          }
        }
        this.$emit("submit", this.specy);
      }
    },
    getInputClass(error: string): string {
      return getInputClass(error);
    },
    checkForm() {
      let checkOk = true;
      if (this.specy.botanicalName === "" || this.specy.botanicalName == undefined) {
        checkOk = false;
      }
      return checkOk;
    },
    initFormError(): FormErrorSpecy {
      return {
        botanicalNameError: "",
        valid: true,
      };
    },
  },
});
</script>
