<template>
  <div class="table-container">
    <!-- v1 -->
    <div class="" v-if="tableType == '1'">
      <!-- 表头 -->
      <div class="table-header-v1">
        <div v-for="(col, index) in columns" :key="index" class="header-cell-v1">
          {{ col }}
        </div>
      </div>

      <!-- 表格内容 -->
      <div class="table-body">
        <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="table-row-v1">
          <div v-for="(cell, colIndex) in row" :key="colIndex" class="table-cell-v1">
            {{ cell }}
          </div>
        </div>
      </div>
    </div>
    <!-- v2 -->
    <div class="" v-if="tableType == '2'">
      <!-- 表头 -->
      <div class="table-header-v2">
        <div v-for="(col, index) in columns" :key="index" class="header-cell-v2">
          {{ col }}
        </div>
      </div>

      <!-- 表格内容 -->
      <div class="table-body">
        <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="table-row-v2">
          <div v-for="(cell, colIndex) in row" :key="colIndex" class="table-cell-v2">
            {{ cell }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "customTable",
  props: {
    columns: {
      type: Array,
      required: true,
      default: () => [],
    },
    rows: {
      type: Array,
      required: true,
      default: () => [],
    },
    tableType: {
      type: String,
      default: "1",
    },
  },
};
</script>

<style scoped>
.table-container {
  width: 100%;
  border: 1px solid #ccc;
  box-sizing: border-box;
  overflow: hidden;
}

.table-header-v1,
.table-row-v1 {
  display: flex;
}

.table-header-v1 {
  font-weight: 600;
  background-color: #fff;
}

.table-body {
  overflow-y: auto;
  overflow-x: hidden;
}

.header-cell-v2 {
  background: #ffe374;
}

.header-cell-v1,
.table-cell-v1 {
  flex: 1;
  padding: 10rpx;
  border: 1px solid #f1f1f4;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.8px;
}

.table-header-v2,
.table-row-v2 {
  display: flex;
}

.table-body {
  overflow-y: auto;
  overflow-x: hidden;
}

.header-cell-v2 {
  background: #ffe374;
}

.header-cell-v2,
.table-cell-v2 {
  flex: 1;
  padding: 10rpx;
  border: 1px solid #8d543e;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.8px;
}
.table-row-v2:nth-child(odd) {
  background: #f0b656;
}

.table-row-v2:nth-child(even) {
  background: #ffdb87;
}
</style>
