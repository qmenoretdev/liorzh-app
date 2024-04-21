<template>
  <div class="grid">
    <div :class="getCssClass.container.default + getFormClass">
      <div class="field grid">
        <label class="col-12 sm:col-3">{{ $t("variety.label") }}* : </label>
        <div class="col-12 sm:col-9">
          <template v-if="sowing.variety.id !== 0">
            {{ sowing.variety.specy.botanicalName }} ({{ sowing.variety.name }})
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
        v-if="sowing.variety.id === 0"
      />
      <div class="field grid">
        <label for="location" class="col-12 sm:col-3"
          >{{ $t("sowing.location") }} :
        </label>
        <div class="col-12 sm:col-4">
          <select
            id="location"
            v-model="sowing.location"
            :class="getCssClass.input.default"
          >
            <option
              v-for="location in getLocations"
              :key="location.value"
              :value="location.value"
            >
              {{ $t(location.name) }}
            </option>
          </select>
        </div>
      </div>
      <div class="field grid">
        <label for="sowingYear" class="col-12 sm:col-3 mb-0">{{
          $t("sowing.year")
        }}</label>
        <div class="col-12 sm:col-8">
          <input
            id="sowingYear"
            placeholder="0"
            type="number"
            :class="getCssClass.input.default"
            v-model.number="sowing.year"
            @keyup.enter="submit()"
          />
        </div>
      </div>
      <div class="field grid">
        <label for="sowingDate" class="col-12 sm:col-3 mb-0"
          >{{ $t("sowing.sowingDate") }}*</label
        >
        <div class="col-12 sm:col-8">
          <input
            id="sowingDate"
            type="date"
            :class="getCssClass.input.default"
            v-model="sowing.sowingDate"
            @keyup.enter="submit()"
          />
        </div>
        <FormMessage class="col-12" :message="formError.sowingDateError" />
      </div>
      <div class="field grid">
        <label for="seedsNumber" class="col-12 sm:col-3 mb-0">{{
          $t("sowing.seedsNumber")
        }}</label>
        <div class="col-12 sm:col-8">
          <input
            id="seedsNumber"
            placeholder="0"
            type="number"
            :class="getCssClass.input.default"
            v-model.number="sowing.seedsNumber"
            @keyup.enter="submit()"
          />
        </div>
      </div>
      <div class="field grid">
        <label for="description" class="col-12 sm:col-3">{{
          $t("sowing.description")
        }}</label>
        <div class="col-12 sm:col-8">
          <textarea
            id="description"
            placeholder=""
            type="text"
            :class="getCssClass.input.default"
            v-model="sowing.description"
          />
        </div>
      </div>
    </div>
    <div :class="getCssClass.container.default + ' col-6'" v-if="!isUpdateMode">
      <VarietyDataTable
        class="col-12"
        v-if="getUserVarieties.length > 0"
        :data="getUserVarieties"
        :addable="false"
        :editable="false"
        @selectVariety="selectVariety"
      />
      <template v-else-if="!loadingVarieties">
        <InlineMessage class="col-12 mb-1" :severity="'info'">{{
          $t("message.variety.none")
        }}</InlineMessage>
      </template>
      <LoadingSpinner v-else />
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
import FormMessage from "@/components/common/FormMessage.vue";
import Checkbox from "primevue/checkbox";
import sowingScript from "@/scripts/SowingScript";
import VarietyDataTable from "@/components/variety/VarietyDataTable.vue";
import type { Variety } from "@/models/Variety";
import { useI18n } from "vue-i18n";
import { toInputDate } from "@/utils/date";
import type SelectOption from "@/models/form/SelectOption";
import { locationOptions } from "@/utils/location";
import { useUserStore } from "@/stores/user";
import type { ToastMessageOptions } from "primevue/toast";
import toastService from "@/services/ToastService";
import projectService from "@/services/ProjectService";
import responseService from "@/services/ResponseService";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";

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
    sowingToUpdate: {
      default: sowingScript.init(),
    },
  },
  setup() {
    const { t } = useI18n();
    return {
      chooseVarietyErrorMessage: t("message.chooseVarietyError"),
      sowingDateErrorMessage: t("message.sowing.sowingDateError"),
    };
  },
  data() {
    return {
      sowing: sowingScript.init(),
      formError: this.initFormError(),
      customType: "",
      userVarieties: [] as Variety[],
      loadingVarieties: true,
    };
  },
  async mounted() {
    if (!this.isUpdateMode) {
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
    }
    this.loadingVarieties = false;
  },
  watch: {
    sowingToUpdate(newSowingToUpdate) {
      this.sowing = newSowingToUpdate;
      this.sowing.sowingDate = toInputDate(this.sowing.sowingDate);
    },
    varietyToAddSowing(newVarietyToAddSowing) {
      this.sowing.variety = newVarietyToAddSowing;
    },
  },
  computed: {
    getCssClass() {
      return cssClass;
    },
    isUpdateMode(): boolean {
      return this.sowingToUpdate && this.sowingToUpdate.id !== 0;
    },
    getFormClass(): string {
      return " col-12" + (this.isUpdateMode ? "" : " md:col-6");
    },
    getLocations(): SelectOption[] {
      return locationOptions;
    },
    getUserVarieties(): Variety[] {
      return this.userVarieties;
    },
  },
  methods: {
    submit() {
      if (this.checkForm()) {
        this.$emit("submit", this.sowing);
      }
    },
    getInputClass(error: string): string {
      return getInputClass(error);
    },
    checkForm() {
      this.formError = this.initFormError();
      let checkOk = true;
      if (this.sowing.variety.id === 0) {
        this.formError.varietyError = this.chooseVarietyErrorMessage;
        checkOk = false;
      }
      if (this.sowing.sowingDate === undefined || this.sowing.sowingDate === "") {
        this.formError.sowingDateError = this.sowingDateErrorMessage;
        checkOk = false;
      }
      return checkOk;
    },
    initFormError(): object {
      return {
        varietyError: "",
        sowingDateError: "",
      };
    },
    async selectVariety(variety: Variety) {
      this.sowing.variety = variety;
    },
  },
});
</script>
