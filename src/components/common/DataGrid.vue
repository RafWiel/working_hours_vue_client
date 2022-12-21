<template>
  <v-container
    fluid
    :class="$vuetify.breakpoint.smAndUp ? 'pt-3' : ''"
    class="pa-0">
    <!-- Header -->
    <v-row
      v-if="$vuetify.breakpoint.smAndUp"
      class="no-gutters px-4">
      <!-- 12 columns is to little, thats why one column and inside divs with percentage width -->
      <v-col class="pl-0 py-0 text-body-2 grey--text ">
        <v-checkbox
          @click="$emit('selectAll', isAllSelected)"
          v-if="isSelectionCheckbox"
          v-model="isAllSelected"
          hide-details
          class="shrink list_column mt-0"/>
        <div
          v-for="column in $vuetify.breakpoint.lgAndUp ? columns : limitedColumns"
          :key="column.id"
          :style="`width: ${$vuetify.breakpoint.mdAndDown ? column.limitedWidth : column.fullWidth}%`"
          :class="isSelectionCheckbox ? 'header_selection_offset_y' : ''"
          @click="onSort(column.id)"
          @keyup.space="onSort(column.id)"
          class="list_column text_ellipsis"
          style="height: 1.7em;"
          v-ripple>
          {{ column.text }}
          <v-icon
            v-if="sorting.column === column.id && sorting.order === sortOrder.ascending"
            style="margin-top: -2px;">mdi-chevron-up</v-icon>
          <v-icon
            v-if="sorting.column === column.id && sorting.order === sortOrder.descending"
            style="margin-top: -2px;">mdi-chevron-down</v-icon>
        </div>
      </v-col>
      <v-col cols="auto">
        <!-- Invisible icon to match header and rows columns width -->
        <v-icon
          v-if="isDeleteButton"
          style="opacity: 0">
          mdi-close
        </v-icon>
      </v-col>
    </v-row>
    <v-divider v-if="$vuetify.breakpoint.smAndUp" class="mt-0 py-0"/>
    <!-- Rows portrait view -->
    <v-container
      v-if="$vuetify.breakpoint.xs"
      fluid
      class="pa-0">
      <v-row class="no-gutters">
        <v-col class="mx-3 mt-3">
          <v-checkbox
            @click="$emit('selectAll', isAllSelected)"
            v-if="isSelectionCheckbox"
            v-model="isAllSelected"
            label="Zaznacz wszystko"
            hide-details
            class="shrink list_column mt-0"/>
        </v-col>
      </v-row>
      <v-row
        :key="item.id"
        @click="$emit('itemClick', item.id)"
        v-for="(item, index) in items"
        v-ripple
        justify="center"
        class="no-gutters list_row pt-2">
        <v-col>
          <v-row class="no-gutters px-3" align="center">
            <v-col v-if="isSelectionCheckbox">
              <v-checkbox
                @click="$emit('selectionChanged')"
                v-model="item.isSelected"
                hide-details
                class="shrink list_column mt-0"/>
            </v-col>
            <v-col cols="11">
              <v-row
                :key="column.id"
                v-for="column in limitedColumns"
                class="no-gutters pa-0"
                align="center">
                <!-- Name column -->
                <v-col :cols="portraitCols" class="text_ellipsis label pr-1">
                  {{ column.text }}
                </v-col>
                <!-- Value column -->
                <v-col class="text_ellipsis">
                  {{ column.isIndex ? index + 1 : item[column.value] }}
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="isDeleteButton">
              <v-icon
                class="deleteButton"
                @click.stop="$emit('itemDeleteClick', item.id)">
                mdi-close
              </v-icon>
            </v-col>
          </v-row>
          <!-- Divider (except last row) -->
          <v-divider v-if="index != items.length - 1" class="mt-2"/>
          <div v-else/>
        </v-col>
      </v-row>
    </v-container>
    <!-- Rows horizontal view -->
    <v-container
      v-if="$vuetify.breakpoint.smAndUp"
      fluid
      class="pa-0">
      <v-row
        v-for="(item, index) in items"
        :key="item.id"
        v-ripple
        class="no-gutters list_row"
        align="center" justify="center"
        @click="$emit('itemClick', item.id)">
        <v-col>
          <v-row class="no-gutters px-4" align="center">
            <v-col class="pl-0 py-1">
              <v-checkbox
                @click="$emit('selectionChanged')"
                v-if="isSelectionCheckbox"
                v-model="item.isSelected"
                hide-details
                class="shrink list_column mt-0"/>
              <div
                v-for="column in $vuetify.breakpoint.lgAndUp ? columns : limitedColumns"
                :key="column.id"
                :style="`width: ${$vuetify.breakpoint.mdAndDown ? column.limitedWidth : column.fullWidth}%`"
                :class="isSelectionCheckbox ? 'selection_offset_y' : ''"
                class="list_column text_ellipsis">
                {{ column.isIndex ? index + 1 : item[column.value] }}
              </div>
            </v-col>
            <v-col cols="auto">
              <v-icon
                v-if="isDeleteButton"
                class="deleteButton"
                @click.stop="$emit('itemDeleteClick', item.id)">
                mdi-close
              </v-icon>
            </v-col>
          </v-row>
          <v-divider class="px-1 py-0" v-if="index != items.length - 1"/>
        </v-col>
      </v-row>
    </v-container>
    <div
      v-if="items.length === 0"
      class="d-flex justify-center text-body-1 grey--text text--lighten-2 py-8">
      Brak danych
    </div>
  </v-container>
</template>

<script>
import sortOrder from '@/enums/sortOrder';

export default {
  name: 'DataGrid',
  props: {
    items: Array,
    columns: Array,
    portraitCols: Number,
    isDeleteButton: Boolean,
    isSelectionCheckbox: Boolean,
  },
  computed: {
    limitedColumns() {
      // filter headers for mobile portrait view
      return this.columns.filter((item) => item.limitedWidth !== undefined);
    },
  },
  data: () => ({
    sorting: {
      column: null,
      order: sortOrder.ascending,
    },
    sortOrder,
    isAllSelected: false,
  }),
  methods: {
    onSort(columnId) {
      if (columnId !== this.sorting.column) {
        this.sorting.column = columnId;
        this.sorting.order = sortOrder.ascending;
      }
      else if (this.sorting.order === sortOrder.ascending) {
        this.sorting.order = sortOrder.descending;
      }
      else {
        this.sorting.order = sortOrder.ascending;
      }

      this.$emit('sort', this.sorting);
    },
  },
  // filters: {
  //   itemFilter(value, filterName) {
  //     if (filterName === 'formatDate') {
  //       if (value < 10) {
  //         return `0${value}`;
  //       }
  //     }
  //     return value;
  //   },
  // },
};
</script>

<style lang="scss" scoped>

  .text_ellipsis {
    overflow: clip;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 10px;

    @media (max-width: 600px) {
      overflow: hidden;
      padding-right: 0;
    }
  }

  .list_row {
    cursor: pointer;
    user-select: none;
    transition: background-color .25s;
  }

  .list_row:hover {
    //background-color: rgba(41,116,183, .35);
    background-color: #dce1e6;
    transition: background-color 0s;
  }

  .list_row:selection {
    background-color: #ff00f0;
    transition: background-color 0s;
  }

  .list_column {
    display: inline-block;
    cursor: pointer;
  }

  .label {
    color: rgba(160,160,160);
    font-size: .8em;
  }

  .v-icon:after {
    opacity: 0 !important;
  }

  .deleteButton:hover {
    color: #ff0000;
    transition: color 0s;
  }

  .header_selection_offset_y {
    margin-top: -5px;
    vertical-align: middle;
  }

  .selection_offset_y {
    margin-top: -10px;
    vertical-align: middle;
  }

</style>
