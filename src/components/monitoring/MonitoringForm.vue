<template>
  <div>
    <Dialog
      :header="header"
      v-model:visible="visibleData"
      modal
      :style="{ width: '50vw' }"
      @update:visible="closeModal"
    >
      <div :class="getCssClass.container.default">
        <div class="field grid">
          <label for="name" class="col-12 sm:col-3"
            >Nom*&nbsp;
            <div
              class="pi pi-question-circle"
              v-tooltip="'Champ personnel pour nommer votre suivi.'"
            ></div
          ></label>
          <div class="col-12 sm:col-8">
            <input
              id="name"
              placeholder="2023-Annuel"
              type="text"
              :class="getInputClass(formError.nameError)"
              v-model="monitoring.name"
              @keyup.enter="submit()"
            />
          </div>
        </div>
        <FormMessage :message="formError.nameError" />
        <div class="field grid">
          <label for="type" class="col-12 sm:col-3">Type</label>
          <div class="col-12 sm:col-8">
            <select
              id="type"
              v-model="monitoring.type"
              :class="getCssClass.input.default"
            >
              <option v-for="type in monitoringTypes" :key="type.code" :value="type.code">
                {{ type.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="field grid">
          <label for="name" class="col-12 sm:col-3"
            >Actif&nbsp;
            <div
              class="pi pi-question-circle"
              v-tooltip="
                'Rendre inactif un suivi signifie que les cultures et récoltes associées sont terminées. Facilite le tri dans le workspace.'
              "
            ></div
          ></label>
          <div class="col-12 sm:col-8">
            <input
              id="enabled"
              type="checkbox"
              v-model="monitoring.enabled"
              @keyup.enter="submit()"
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
      <div class="col-12">
        <Button
          rounded
          :label="submitButtonLabel"
          @click="submit()"
          :class="
            'col-4 md:col-3 col-offset-4' +
            (monitoringToUpdate.id === 0 ? ' button-create' : '')
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
import monitoringScript from "@/scripts/MonitoringScript";
import { MonitoringType } from "@/models/Monitoring";
import FormMessage from "@/components/common/FormMessage.vue";

export default defineComponent({
  extends: ModalFormCommon,
  components: { Dialog, Button, InlineMessage, FormMessage },
  props: {
    monitoringToUpdate: {
      default: monitoringScript.init(),
    },
  },
  data() {
    return {
      monitoring: monitoringScript.init(),
      formError: this.initFormError(),
      monitoringTypes: [
        MonitoringType.ANNUAL,
        MonitoringType.BI_ANNUAL,
        MonitoringType.PERSISTENT,
        MonitoringType.OTHER,
      ],
    };
  },
  watch: {
    monitoringToUpdate(newMonitoringToUpdate) {
      this.monitoring = newMonitoringToUpdate;
    },
  },
  computed: {
    getCssClass() {
      return cssClass;
    },
  },
  methods: {
    submit() {
      this.$emit("submit", this.monitoring);
    },
    getInputClass(error: string): string {
      return getInputClass(error);
    },
    checkForm() {
      this.formError = this.initFormError();
      let checkOk = true;
      if (this.monitoring.name === "" || this.monitoring.name == undefined) {
        this.formError.nameError = "Le nom est obligatoire";
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
