<template>
  <div>
    <DataTable
      :value="data"
      scrollable
      scrollHeight="480px"
      selectionMode="single"
      :metaKeySelection="false"
      dataKey="id"
    >
      <ColumnGroup type="header">
        <Row>
          <Column header="Espèce" :colspan="2"></Column>
          <Column header="Variété" :rowspan="2"></Column>
          <Column header="Description" :rowspan="2"></Column>
          <Column header="" :rowspan="2"></Column>
        </Row>
        <Row>
          <Column header="Nom botanique"></Column>
          <Column header="Nom(s) commun(s)"></Column>
        </Row>
      </ColumnGroup>
      <Column field="specy.botanicalName">
        <template #body="slotProps">
          <i>{{ slotProps.data.specy.botanicalName }}</i>
        </template>
      </Column>
      <Column field="specy.frenchCommonNames">
        <template #body="slotProps">
          {{
            specyService.commonNamesArrayToString(slotProps.data.specy.frenchCommonNames)
          }}
        </template>
      </Column>
      <Column field="name"></Column>
      <Column field="description"></Column>
      <Column v-if="editable || addable">
        <template #body="slotProps">
          <Button
            icon="pi pi-file-edit"
            class="mr-2"
            text
            raised
            rounded
            @click="updateVariety(slotProps.data)"
            v-if="editable"
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
            icon="pi pi-plus-circle"
            text
            raised
            rounded
            @click="addVarietyToUser(slotProps.data)"
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
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Button from "primevue/button";

const emit = defineEmits(["update", "delete", "addToUser"]);
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

function updateVariety(variety: Variety) {
  emit("update", variety);
}

function deleteVariety(variety: Variety) {
  emit("delete", variety);
}

function addVarietyToUser(variety: Variety) {
  emit("addToUser", variety);
}
</script>
