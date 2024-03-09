<template>
  <div>
    <ContextMenu ref="cm" :model="menuModel" @hide="selectedMonitoringLine = null" />
    <DataTable
      v-if="!loading && monitoringLines.length > 0"
      :value="monitoringLines"
      scrollable
      scrollHeight="500px"
      @row-contextmenu="onRowContextMenu"
      contextMenu
      v-model:contextMenuSelection="selectedMonitoringLine"
      selectionMode="single"
      :metaKeySelection="false"
      dataKey="id"
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
          {{ slotProps.data.sowing === undefined ? '' : toStrDate(slotProps.data.sowing.sowingDate) }}
        </template>
      </Column>
      <Column field="planting" :header="$t('monitoringLine.planting')">
        <template #body="slotProps">
          {{ slotProps.data.planting === undefined ? '' : toStrDate(slotProps.data.planting) }}
        </template>
      </Column>
      <Column field="harvest.weight" :header="$t('monitoringLine.harvest.start')">
        <template #body="slotProps">
          {{ slotProps.data.harvest === undefined ? '' : toStrDate(slotProps.data.harvest.start) }}
        </template>
      </Column>
      <Column field="harvest.weight" :header="$t('monitoringLine.harvest.stop')">
        <template #body="slotProps">
          {{ slotProps.data.harvest === undefined ? '' : toStrDate(slotProps.data.harvest.stop) }}
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
import { toStrDate } from "@/utils/date";
import monitoringLineScript from "@/scripts/MonitoringLineScript";
import ContextMenu from "primevue/contextmenu";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const emits = defineEmits(['harvest', 'update', 'delete'])

defineProps({
  monitoringLines: {
    default: [] as MonitoringLine[],
  },
  loading: {
    default: false,
  },
});

const cm = ref();
const selectedMonitoringLine = ref(monitoringLineScript.init());
const menuModel = ref([
    {label: t('button.harvest'), icon: 'pi pi-fw pi-plus', command: () => emits('harvest', selectedMonitoringLine.value)},
    {label: t('button.update'), icon: 'pi pi-fw pi-file-edit', command: () => emits('update', selectedMonitoringLine.value)},
    {label: t('button.delete'), icon: 'pi pi-fw pi-trash', command: () => emits('delete', selectedMonitoringLine.value)}
]);

function onRowContextMenu(event: any) {
  cm.value.show(event.originalEvent);
}

</script>