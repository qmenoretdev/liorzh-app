<template>
  <div class="grid">
    <div :class="getCssClass.container.default + getFormClass">
      <div class="field grid">
        <label for="monitoring" class="col-12 sm:col-3"
          >{{ $t("monitoring.label") }}* :
        </label>
        <div class="col-12 sm:col-4" v-if="!isUpdateMode && monitoringToAddLine.id === 0">
          <select
            id="monitoring"
            v-model="monitoringLine.monitoring"
            :class="getCssClass.input.default"
          >
            <option
              v-for="monitoringIn in getMonitorings"
              :key="monitoringIn.id"
              :value="monitoringIn"
            >
              {{ monitoringIn.name }} ({{ monitoringIn.type }})
            </option>
          </select>
        </div>
        <div class="col-12 sm:col-9" v-else>
          {{ monitoringLine.monitoring.name }} ({{ monitoringLine.monitoring.type }})
        </div>
      </div>
      <FormMessage
        class="col-12"
        :message="formError.monitoringError"
        v-if="monitoringLine.monitoring.id === 0"
      />
      <div class="field grid">
        <label class="col-12 sm:col-3">{{ $t("variety.label") }}* : </label>
        <div class="col-12 sm:col-9">
          <template v-if="monitoringLine.variety.id !== 0">
            {{ monitoringLine.variety.specy.botanicalName }} ({{
              monitoringLine.variety.name
            }})
          </template>
          <template v-else>
            <InlineMessage class="col-12 mb-1" :severity="'info'">{{
              $t("message.chooseVariety")
            }}</InlineMessage>
          </template>
        </div>
      </div>
      <FormMessage
        class="col-12"
        :message="formError.varietyError"
        v-if="monitoringLine.variety.id === 0"
      />
      <div class="field grid" v-if="monitoringLine.variety.id !== 0">
        <label for="sowing" class="col-12 sm:col-3">{{ $t("sowing.label") }}</label>
        <div
          class="col-12 sm:col-4"
          v-if="
            isUpdateMode &&
            monitoringLineToUpdate.sowing !== undefined &&
            monitoringLineToUpdate.sowing.id !== 0
          "
        >
          <select
            id="sowing"
            v-model="monitoringLine.sowing"
            :class="getCssClass.input.default"
          >
            <option :value="monitoringLineToUpdate.sowing">
              {{ toStrDate(monitoringLineToUpdate.sowing.sowingDate) }} ({{
                monitoringLineToUpdate.sowing.location
              }})
            </option>
            <option
              v-for="sowingIn in filterSowings(monitoringLineToUpdate.sowing.id)"
              :key="sowingIn.id"
              :value="sowingIn"
            >
              {{ toStrDate(sowingIn.sowingDate) }} ({{ sowingIn.location }})
            </option>
          </select>
        </div>
        <div class="col-12 sm:col-4" v-else>
          <select
            id="sowing"
            v-model="monitoringLine.sowing"
            :class="getCssClass.input.default"
          >
            <option
              v-for="sowingIn in varietySowings"
              :key="sowingIn.id"
              :value="sowingIn"
            >
              {{ toStrDate(sowingIn.sowingDate) }} ({{ sowingIn.location }})
            </option>
          </select>
        </div>
      </div>
      <div class="field grid">
        <label for="plantNumber" class="col-12 sm:col-3 mb-0">{{
          $t("monitoringLine.plantNumber")
        }}</label>
        <div class="col-12 sm:col-8">
          <input
            id="plantNumber"
            placeholder="0"
            type="number"
            :class="getCssClass.input.default"
            v-model.number="monitoringLine.plantNumber"
            @keyup.enter="submit()"
          />
        </div>
      </div>
      <div class="field grid">
        <label for="description" class="col-12 sm:col-3">{{
          $t("monitoringLine.description")
        }}</label>
        <div class="col-12 sm:col-8">
          <textarea
            id="description"
            placeholder="Un petit jardin très mignon près d'un ruisseau"
            type="text"
            :class="getCssClass.input.default"
            v-model="monitoringLine.description"
          />
        </div>
      </div>
      <div class="field grid">
        <label for="enabled" class="col-12 sm:col-3"
          >{{ $t("monitoringLine.ended") }}&nbsp;
          <div
            class="pi pi-question-circle"
            v-tooltip="$t('monitoringLine.tooltip.ended')"
          ></div
        ></label>
        <div class="col-12 sm:col-8">
          <Checkbox v-model="monitoringLine.ended" :binary="true" id="enabled">
          </Checkbox>
        </div>
      </div>
      <div class="field grid">
        <label for="harvestNumber" class="col-12 sm:col-3 mb-0">{{
          $t("monitoringLine.harvest.number")
        }}</label>
        <div class="col-12 sm:col-8">
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
        <div class="col-12 sm:col-8">
          <input
            id="harvestWeight"
            placeholder="0"
            type="number"
            :class="getCssClass.input.default"
            v-model.number="monitoringLine.harvest.weight"
            @keyup.enter="submit()"
          />
        </div>
      </div>
      <div class="field grid">
        <label for="planting" class="col-12 sm:col-3 mb-0">{{
          $t("monitoringLine.planting")
        }}</label>
        <div class="col-12 sm:col-8">
          <input
            id="planting"
            type="date"
            :class="getCssClass.input.default"
            v-model="monitoringLine.planting"
            @keyup.enter="submit()"
          />
        </div>
      </div>
      <div class="field grid">
        <label for="harvestStart" class="col-12 sm:col-3 mb-0">{{
          $t("monitoringLine.harvest.start")
        }}</label>
        <div class="col-12 sm:col-8">
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
        <div class="col-12 sm:col-8">
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
    <div
      :class="getCssClass.container.default + ' col-6'"
      v-if="!isUpdateMode && !loadingVarieties"
    >
      <VarietyDataTable
        class="col-12"
        v-if="getUserVarieties.length > 0"
        :data="getUserVarieties"
        :addable="false"
        :editable="false"
        @selectVariety="selectVariety"
      />
      <template v-else>
        <InlineMessage class="col-12 mb-1" :severity="'info'">{{
          $t("message.variety.none")
        }}</InlineMessage>
      </template>
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
        class="col-5 md:col-3 col-offset-3 mr-2"
        :loading="loading"
      />
      <Button
        rounded
        :label="'Annuler'"
        @click="quit()"
        class="col-5 md:col-3"
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
import monitoringScript from "@/scripts/MonitoringScript";
import FormMessage from "@/components/common/FormMessage.vue";
import Checkbox from "primevue/checkbox";
import monitoringLineScript from "@/scripts/MonitoringLineScript";
import { useMonitoringStore } from "@/stores/monitoring";
import type { Monitoring } from "@/models/Monitoring";
import VarietyDataTable from "@/components/variety/VarietyDataTable.vue";
import type { Variety } from "@/models/Variety";
import toastService from "@/services/ToastService";
import responseService from "@/services/ResponseService";
import type { ToastMessageOptions } from "primevue/toast";
import { useI18n } from "vue-i18n";
import { toInputDate, toStrDate } from "@/utils/date";
import sowingService from "@/services/SowingService";
import type { Sowing } from "@/models/Sowing";
import projectService from "@/services/ProjectService";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  extends: FormCommon,
  components: {
    Button,
    InlineMessage,
    FormMessage,
    Checkbox,
    VarietyDataTable,
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
      userVarieties: [] as Variety[],
      loadingVarieties: true,
      varietySowings: [] as Sowing[],
    };
  },
  async mounted() {
    try {
      const userStore = useUserStore();
      this.userVarieties = await projectService.getVarietiesByProject(
        userStore.activeProjectUser.project
      );
    } catch (error: any) {
      const toastOptions = toastService.getToastOptions(
        "Impossible de récupérer vos variétés",
        responseService.getApiErrors(error)
      );
      toastOptions.forEach((toastOption: ToastMessageOptions) => {
        this.$toast.add(toastOption);
      });
    }
    this.loadingVarieties = false;
  },
  watch: {
    async monitoringLineToUpdate(newMonitoringLineToUpdate) {
      this.monitoringLine = newMonitoringLineToUpdate;
      this.varietySowings = await sowingService.getSowingsByVarietyAndProject(
        newMonitoringLineToUpdate.variety.id
      );
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
    getUserVarieties(): Variety[] {
      return this.userVarieties;
    },
  },
  methods: {
    submit() {
      if (this.checkForm()) {
        this.$emit("submit", this.monitoringLine);
      }
    },
    getInputClass(error: string): string {
      return getInputClass(error);
    },
    checkForm() {
      this.formError = this.initFormError();
      let checkOk = true;
      if (this.monitoringLine.monitoring.id === 0) {
        this.formError.monitoringError = this.chooseMonitoringErrorMessage;
        checkOk = false;
      }
      if (this.monitoringLine.variety.id === 0) {
        this.formError.varietyError = this.chooseVarietyErrorMessage;
        checkOk = false;
      }
      return checkOk;
    },
    initFormError(): object {
      return {
        varietyError: "",
        monitoringError: "",
      };
    },
    async selectVariety(variety: Variety) {
      this.monitoringLine.variety = variety;
      try {
        this.varietySowings = await sowingService.getSowingsByVarietyAndProject(
          variety.id
        );
      } catch (error: any) {
        const toastOptions = toastService.getToastOptions(
          "Impossible de récupérer la liste des semis de cette variété",
          responseService.getApiErrors(error)
        );
        toastOptions.forEach((toastOption: ToastMessageOptions) => {
          this.$toast.add(toastOption);
        });
      }
    },
    toStrDate(str: string) {
      return toStrDate(str);
    },
    filterSowings(choosenSowingId: number): Sowing[] {
      if (this.monitoringLine.variety.sowings === undefined) return [];
      return this.monitoringLine.variety.sowings.filter((sowing) => {
        sowing.id !== choosenSowingId;
      });
    },
  },
});
</script>
