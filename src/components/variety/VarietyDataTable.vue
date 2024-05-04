<template>
  <div>
    <DataTable
      :value="data"
      scrollable
      scrollHeight="480px"
      selectionMode="single"
      :metaKeySelection="false"
      dataKey="id"
      v-model:selection="selectedVariety"
      @row-select="onSelect"
      v-model:filters="filters"
      filterDisplay="menu"
    >
      <Column
        header="Nom botanique"
        field="specy.botanicalName"
        filterField="specy.botanicalName"
      >
        <template #body="slotProps">
          <span class="flex align-items-center">
            <img
              class="mr-2"
              src="@/assets/img/visible_24px.png"
              v-if="slotProps.data.specy.owner === PUBLIC"
              title="Espèce publique"
            />
            <img
              class="mr-2"
              src="@/assets/img/invisible_24px.png"
              v-else
              :title="'Espèce privée : ' + slotProps.data.specy.owner"
            />
            <i>{{ slotProps.data.specy.botanicalName }}</i></span
          >
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder=""
          />
        </template>
      </Column>
      <Column
        header="Nom(s) commun(s)"
        field="specy.frenchCommonNames"
        filterField="specy.frenchCommonNames"
      >
        <template #body="slotProps">
          {{
            specyService.commonNamesArrayToString(slotProps.data.specy.frenchCommonNames)
          }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder=""
          />
        </template>
      </Column>
      <Column header="Variété" field="name">
        <template #body="slotProps">
          <span class="flex align-items-center">
            <img
              class="mr-2"
              src="@/assets/img/visible_24px.png"
              v-if="slotProps.data.owner === PUBLIC"
              title="Variété publique"
            />
            <img
              class="mr-2"
              src="@/assets/img/invisible_24px.png"
              v-else
              :title="'Variété privée : ' + slotProps.data.owner"
            />
            <i>{{ slotProps.data.name }}</i></span
          >
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder=""
          />
        </template>
      </Column>
      <Column header="Description" field="description">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder=""
          /> </template
      ></Column>
      <Column header="Valide ?" field="valid" sortable>
        <template #body="slotProps">
          {{ showValidity(slotProps.data.valid) }}
        </template>
      </Column>
      <Column v-if="editable || addable">
        <template #body="slotProps">
          <Button
            icon="pi pi-file-edit"
            class="mr-2"
            text
            raised
            rounded
            @click="updateVariety(slotProps.data)"
            v-if="
              editable &&
              (authorizationService.isAdmin() || slotProps.data.owner !== PUBLIC)
            "
          />
          <Button
            icon="pi pi-trash"
            class="mr-2"
            text
            raised
            rounded
            severity="danger"
            @click="deleteVariety(slotProps.data)"
            v-if="editable"
          />
          <Button
            icon="pi pi-eye"
            class="mr-2"
            text
            raised
            rounded
            severity="info"
            @click="publishVariety(slotProps.data)"
            v-if="editable && slotProps.data.owner !== PUBLIC"
            :title="$t('variety.publish')"
          />
          <Button
            icon="pi pi-plus-circle"
            text
            raised
            rounded
            @click="addVarietyToProject(slotProps.data)"
            v-if="addable"
            title="Ajouter à vos variétés"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import type { Variety } from "@/models/Variety";
import specyService from "@/services/SpecyService";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import authorizationService from "@/services/AuthorizationService";
import { PUBLIC } from "@/utils/constant";
import { showValidity } from "@/utils/validity";
import varietyScript from "@/scripts/VarietyScript";
import { ref } from "vue";
import { FilterMatchMode } from "primevue/api";

const emit = defineEmits([
  "update",
  "delete",
  "addToProject",
  "publish",
  "selectVariety",
]);
defineProps({
  data: {
    default: [] as Variety[],
  },
  editable: {
    default: true,
  },
  addable: {
    default: false,
  },
});

const filters = ref({
  "specy.botanicalName": { value: null, matchMode: FilterMatchMode.CONTAINS },
  "specy.frenchCommonNames": { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const selectedVariety = ref(varietyScript.init());

function onSelect() {
  emit("selectVariety", selectedVariety.value);
}

function updateVariety(variety: Variety) {
  emit("update", variety);
}

function deleteVariety(variety: Variety) {
  emit("delete", variety);
}

function publishVariety(variety: Variety) {
  emit("publish", variety);
}

function addVarietyToProject(variety: Variety) {
  emit("addToProject", variety);
}
</script>
