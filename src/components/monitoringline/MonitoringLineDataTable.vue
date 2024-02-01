<template>
  <div>
    <DataTable
      v-if="!loading && monitoringLines.length > 0"
      :value="monitoringLines"
      scrollable
      scrollHeight="400px"
      da.3taKey="id"
    >
      <Column field="variety" :header="$t('variety.label')">
        <template #body="slotProps">
          <i>{{ slotProps.data.variety.specy.botanicalName }}</i> ({{ slotProps.data.variety.name }})
        </template>
      </Column>
      <Column field="plantNumber" :header="$t('monitoringLine.plantNumber')" />
      <Column field="harvest.number" :header="$t('monitoringLine.harvest.number')">
        <template #body="slotProps">
          {{ slotProps.data.harvest === undefined ? '' : slotProps.data.harvest.number }}
        </template>
      </Column>
      <Column field="harvest.weight" :header="$t('monitoringLine.harvest.weight')">
        <template #body="slotProps">
          {{ slotProps.data.harvest === undefined ? '' : slotProps.data.harvest.weight }}
        </template>
      </Column>
      <Column field="sowing" :header="$t('sowing.label')">
        <template #body="slotProps">
          {{ slotProps.data.sowing === undefined ? '' : slotProps.data.sowing.sowingDate }}
        </template>
      </Column>
      <Column field="planting" :header="$t('monitoringLine.planting')" />
      <Column field="harvest.weight" :header="$t('monitoringLine.harvest.start')">
        <template #body="slotProps">
          {{ slotProps.data.harvest === undefined ? '' : slotProps.data.harvest.start }}
        </template>
      </Column>
      <Column field="harvest.weight" :header="$t('monitoringLine.harvest.stop')">
        <template #body="slotProps">
          {{ slotProps.data.harvest === undefined ? '' : slotProps.data.harvest.stop }}
        </template>
      </Column>
      <Column field="description" :header="$t('monitoringLine.description')" />
    </DataTable>
    <LoadingSpinner v-else-if="loading" />
    <InlineMessage v-else severity="info" class="col-12">
      {{ $t('message.monitoringLine.noResult') }}
    </InlineMessage>
  </div>
</template>

<script setup lang="ts">
import type { MonitoringLine } from "@/models/MonitoringLine";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { ref } from "vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import InlineMessage from "primevue/inlinemessage";

const props = defineProps({
  monitoringLines: {
    default: [] as MonitoringLine[],
  },
  loading: {
    default: false,
  },
});
</script>