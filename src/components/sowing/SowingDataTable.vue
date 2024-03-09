<template>
  <div>
    <DataTable
      :value="sowings"
      scrollable
      scrollHeight="480px"
      selectionMode="single"
      :metaKeySelection="false"
      dataKey="id"
    >
      <Column field="variety" :header="$t('variety.label')">
        <template #body="slotProps">
          <i>{{ slotProps.data.variety.specy.botanicalName }}</i> ({{ slotProps.data.variety.name }})
        </template>
      </Column>
      <Column field="location" :header="$t('sowing.location')">
        <template #body="slotProps">
          {{ $t(showLocation(slotProps.data.location)) }}
        </template>
      </Column>
      <Column field="sowingDate" :header="$t('sowing.sowingDate')">
        <template #body="slotProps">
          {{ toStrDate(slotProps.data.sowingDate) }}
        </template>
      </Column>
      <Column field="year" :header="$t('sowing.year')"></Column>
      <Column field="seedsNumber" :header="$t('sowing.seedsNumber')"></Column>
      <Column field="description" :header="$t('sowing.description')"></Column>
      <Column v-if="editable || addable">
        <template #body="slotProps">
          <Button
            icon="pi pi-file-edit"
            class="mr-2"
            text
            raised
            rounded
            @click="updateSowing(slotProps.data)"
            v-if="editable && (authorizationService.isAdmin() || slotProps.data.owner !== PUBLIC)"
          />
          <Button
            icon="pi pi-trash"
            class="mr-2"
            text
            raised
            rounded
            severity="danger"
            @click="deleteSowing(slotProps.data)"
            v-if="editable"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import type { Sowing } from "@/models/Sowing";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import authorizationService from "@/services/AuthorizationService";
import { PUBLIC } from "@/utils/constant";
import { showLocation } from "@/utils/location";
import { toStrDate } from "@/utils/date";

const emit = defineEmits(["update", "delete"]);
defineProps({
  sowings: {
    default: [] as Sowing[],
  },
  editable: {
    default: true,
  },
  addable: {
    default: false,
  },
});

function updateSowing(sowing: Sowing) {
  emit("update", sowing);
}

function deleteSowing(sowing: Sowing) {
  emit("delete", sowing);
}

</script>
