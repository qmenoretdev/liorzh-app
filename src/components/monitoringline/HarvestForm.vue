<template>
  <div class="grid">
    <div :class="getCssClass.container.default + getFormClass">
      <div class="field grid">
        <label for="harvestNumber" class="col-12 sm:col-3 mb-0">{{
          $t("monitoringLine.harvest.addNumber")
        }}</label>
        <div class="col-12 sm:col-3">
          <input
            id="harvestNumber"
            placeholder="0"
            type="number"
            :class="getCssClass.input.default"
            v-model.number="harvestNumber"
            @keyup.enter="add()"
          />
        </div>
        <label for="harvestWeight" class="col-12 sm:col-3 mb-0">{{
          $t("monitoringLine.harvest.addWeight")
        }}</label>
        <div class="col-12 sm:col-3">
          <input
            id="harvestWeight"
            placeholder="0"
            type="number"
            :class="getCssClass.input.default"
            v-model.number="harvestWeight"
            @keyup.enter="add()"
          />
        </div>
      </div>
      <div class="col-12">
        <Button
          rounded
          severity="info"
          :label="$t('button.add')"
          @click="add()"
          class="col-4 md:col-3 col-offset-4"
        />
      </div>
      <div class="field grid">
        <label for="harvestNumber" class="col-12 sm:col-3 mb-0">{{
          $t("monitoringLine.harvest.number")
        }}</label>
        <div class="col-12 sm:col-6">
          <input
            id="harvestNumber"
            placeholder="0"
            type="number"
            :class="getCssClass.input.default"
            v-model.number="monitoringLine.harvest.number"
            @keyup.enter="submit()"
          />
        </div>
      </div>
      <div class="field grid">
        <label for="harvestWeight" class="col-12 sm:col-3 mb-0">{{
          $t("monitoringLine.harvest.weight")
        }}</label>
        <div class="col-12 sm:col-6">
          <input
            id="harvestWeight"
            placeholder="0"
            type="number"
            :class="getCssClass.input.default"
            v-model.number="monitoringLine.harvest.weight"
            @keyup.enter="submit()"
          />
        </div>
        <label
          v-if="totalWeightAdd !== 0"
          class="col-12 sm:col-3 mb-0"
          :style="getOperationStyle(totalWeightAdd)"
        >
          {{ getOperation(totalWeightAdd) }}
        </label>
      </div>
      <div class="field grid">
        <label for="harvestStart" class="col-12 sm:col-3 mb-0">{{
          $t("monitoringLine.harvest.start")
        }}</label>
        <div class="col-12 sm:col-6">
          <input
            id="harvestStart"
            type="date"
            :class="getCssClass.input.default"
            v-model="monitoringLine.harvest.start"
            @keyup.enter="submit()"
          />
        </div>
      </div>
      <div class="field grid">
        <label for="harvestStop" class="col-12 sm:col-3 mb-0">{{
          $t("monitoringLine.harvest.stop")
        }}</label>
        <div class="col-12 sm:col-6">
          <input
            id="harvestStop"
            type="date"
            :class="getCssClass.input.default"
            v-model="monitoringLine.harvest.stop"
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
        class="col-4 md:col-3 col-offset-4"
        :loading="loading"
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
import monitoringScript from "@/scripts/MonitoringScript";
import FormMessage from "@/components/common/FormMessage.vue";
import Checkbox from "primevue/checkbox";
import monitoringLineScript from "@/scripts/MonitoringLineScript";
import { useMonitoringStore } from "@/stores/monitoring";
import type { Monitoring } from "@/models/Monitoring";
import VarietyDataTable from "@/components/variety/VarietyDataTable.vue";
import type { Variety } from "@/models/Variety";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import { useI18n } from "vue-i18n";
import { toInputDate } from "@/utils/date";

export default defineComponent({
  extends: FormCommon,
  components: {
    Button,
    InlineMessage,
    FormMessage,
    Checkbox,
    VarietyDataTable,
    LoadingSpinner,
  },
  props: {
    monitoringLineToUpdate: {
      default: monitoringLineScript.init(),
    },
    monitoringToAddLine: {
      default: monitoringScript.init(),
    },
  },
  setup() {
    const { t } = useI18n();
    return {
      chooseMonitoringErrorMessage: t("message.monitoringLine.chooseMonitoringError"),
      chooseVarietyErrorMessage: t("message.chooseVarietyError"),
    };
  },
  data() {
    return {
      monitoringLine: monitoringLineScript.init(),
      formError: this.initFormError(),
      customType: "",
      loadingVarieties: false,
      userVarieties: [] as Variety[],
      harvestNumber: 0 as number,
      harvestWeight: 0 as number,
      totalNumberAdd: 0 as number,
      totalWeightAdd: 0 as number,
    };
  },
  watch: {
    monitoringLineToUpdate(newMonitoringLineToUpdate) {
      this.monitoringLine = newMonitoringLineToUpdate;
      this.monitoringLine.planting =
        this.monitoringLine.planting === undefined
          ? undefined
          : toInputDate(this.monitoringLine.planting);
      if (this.monitoringLine.harvest !== undefined) {
        this.monitoringLine.harvest.start =
          this.monitoringLine.harvest.start === undefined
            ? undefined
            : toInputDate(this.monitoringLine.harvest.start);
        this.monitoringLine.harvest.stop =
          this.monitoringLine.harvest.stop === undefined
            ? undefined
            : toInputDate(this.monitoringLine.harvest.stop);
      }
    },
    monitoringToAddLine(newMonitoringToAddLine) {
      this.monitoringLine.monitoring = newMonitoringToAddLine;
    },
  },
  computed: {
    getCssClass() {
      return cssClass;
    },
    getMonitorings(): Monitoring[] {
      const monitoringStore = useMonitoringStore();
      return monitoringStore.monitorings;
    },
    isUpdateMode(): boolean {
      return this.monitoringLineToUpdate && this.monitoringLineToUpdate.id !== 0;
    },
    getFormClass(): string {
      return " col-12" + (this.isUpdateMode ? "" : " md:col-6");
    },
  },
  methods: {
    submit() {
      if (this.checkForm()) {
        this.$emit("submit", this.monitoringLine);
      }
    },
    reset() {
      this.harvestNumber = 0;
      this.harvestWeight = 0;
      this.totalNumberAdd = 0;
      this.totalWeightAdd = 0;
    },
    add() {
      if (this.monitoringLine.harvest === undefined) {
        this.monitoringLine.harvest = monitoringLineScript.initHarvest();
      }
      if (this.monitoringLine.harvest.number === undefined) {
        this.monitoringLine.harvest.number = 0;
      }
      if (this.monitoringLine.harvest.weight === undefined) {
        this.monitoringLine.harvest.weight = 0;
      }
      this.monitoringLine.harvest.number += Number(this.harvestNumber);
      this.monitoringLine.harvest.weight += Number(this.harvestWeight);
      this.totalNumberAdd += Number(this.harvestNumber);
      this.totalWeightAdd += Number(this.harvestWeight);
      this.harvestNumber = 0;
      this.harvestWeight = 0;
    },
    getInputClass(error: string): string {
      return getInputClass(error);
    },
    checkForm() {
      this.formError = this.initFormError();
      let checkOk = true;
      return checkOk;
    },
    initFormError(): object {
      return {};
    },
    getOperation(total: number): string {
      if (total === 0) return "";
      return total > 0 ? "+" + total : total.toString();
    },
    getOperationStyle(total: number): string {
      if (total === 0) return "";
      return total > 0 ? "color: green" : "color: red";
    },
  },
});
</script>
