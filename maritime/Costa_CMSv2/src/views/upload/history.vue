<template>
  <div class="root_div">
    <el-container>
      <el-header height="10px" />
      <el-main>
        <div class="table_div">
          <el-form ref="form" :model="form">
            <el-row style="height: 40px">
              <el-col class="filter-form-el-col" :offset="2" :md="14" :sm="24" :xs="24">
                <el-form-item label="港口关键字:" style="text-align: center">
                  <el-row style="margin-left: 100px">
                    <el-input v-model="form.portNameSearch" placeholder="Please enter portname！" @keyup.enter.native="onEnterSearch" />
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="end">
              <el-col :md="22" style="text-align: right">
                <el-button size="small" type="primary" class="searchBtn" @click="onSearchOrder()">Search</el-button>
                <!--                <el-button size="small" type="primary" class="searchBtn" @click="onSearchExact()">精准匹配</el-button>-->
                <el-button size="small" type="primary" plain class="clearBtn" @click="onClearCondition()">Clear Condition</el-button>
              </el-col>
            </el-row>
            <hr :span="24" class="hr">
            <el-row>
              <el-button size="small" class="deleteBtn" @click.native="delArray()" type="danger">批量删除</el-button>
              <el-button size="small" type="primary" class="cancelBtn" @click.native="toggleSelection()">取消选择</el-button>
              <el-button size="small" type="primary" class="cancelBtn" @click.native="getDistance()">导出数据</el-button>
            </el-row>
            <el-table
              ref="multipleTable"
              v-loading="listLoading"
              tooltip-effect="dark"
              element-loading-text="Loading"
              @selection-change="handleSelectionChange"
              :data="portsList"
              border
              fit
              style="margin-top: 20px"
            >
              <el-table-column type="selection" align="center" />
              <el-table-column label="序号">
                <template scope="scope">
                  <span>{{(currentPage - 1) *num + scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="portNameFrom" label="出发港口" width="100px" />
              <el-table-column prop="countryOrAreaFrom" label="出发港口所属国家/地区" width="100px" />
              <el-table-column prop="shipCanCalledFrom" label="出发港口可停靠船只" width="140px" />
              <el-table-column prop="operationalTimeFrom" label="出发港口引水站耗时" width="100px" />
              <el-table-column prop="portNameTo" label="到达港口" />
              <el-table-column prop="countryOrAreaTo" label="到达港口所属国家/地区" />
              <el-table-column prop="shipCanCalledTo" label="到达港口可停靠船只" width="140px" />
              <el-table-column prop="operationalTimeTo" label="到达港口引水站耗时" />
              <el-table-column prop="distance" label="距离" />
              <el-table-column label="option" width="90px" fixed="right">
                <template slot-scope="scope">
                  <el-dropdown>
                    <el-button type="primary" plain>
                      <i class="el-icon-s-operation" /><i
                        class="el-icon-arrow-down el-icon--right"
                      />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="operationClick(scope.row,0)">Edit</el-dropdown-item>
                      <el-dropdown-item @click.native="operationClick(scope.row,1)">Delete</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>="operation" label="Operation" />
            </el-table>
            <el-row style="margin-top: 20px" type="flex" justify="center">
              <el-pagination
                background
                :page-size="this.pageSize"
                :current-page="currentPage"
                layout="total,prev,pager,next,jumper"
                :total="this.totalSize"
                @current-change="handleCurrentChange"
              />
            </el-row>
            <el-dialog :visible.sync="dialogFormVisible" :before-close="updateCancel">
              <el-form label-width="120px" :model="portsform">
                <el-form-item label="Leg No:">
                  <el-input v-model="form.legId" :disabled="true" placeholder="Please Enter Staff No" />
                </el-form-item>
                <el-form-item label="出发港口">
                  <el-input v-model="form.portNameFrom" :disabled="true" placeholder="Please Enter User Name" />
                </el-form-item>
                <el-form-item label="到达港口:">
                  <el-input v-model="form.portNameTo" :disabled="true" placeholder="Please Enter Name" />
                </el-form-item>
                <el-form-item label="距离:" required="true">
                  <el-input v-model="form.distance" placeholder="Please Enter Password" />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click.native="updateCancel">cancel</el-button>
                <el-button type="primary" @click.native="handleUpdate(form.legId,form.distance)">ok</el-button>
              </div>
            </el-dialog>
          </el-form>
        </div>
      </el-main>
      <el-footer>
        <div class="bottom_div">
          <p>
            ©&nbsp;2019&nbsp;Costa&nbsp;Cruises
          </p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getPorts, deleteHistory, hDeleteBatch } from '../../api/port'
import { distanceDownload } from '../../utils/request'
import { updateHistory } from '../../api/port'
import { fuzzyQueryPorts } from '../../api'

export default {
  name: 'Account',
  data() {
    return {
      portsList: [],
      form: {
        legId: '',
        portNameFrom: '',
        portNameTo: '',
        distance: '',
        portNameSearch: ''
      },
      filterList: [],
      portsform: {},
      searchFlag: 0,
      listLoading: false,
      dialogFormVisible: false,
      pageList: [],
      batchPortId: '',
      currentPage: 1,
      pageSize: 200,
      num: 200,
      totalSize: 0,
      totalList: [],
      tempList: [],
      deletePortId: '',
      multipleSelection: []
    }
  },
  created() {
    this.getPortsList()
  },
  methods: {
    handleUpdate(legId, distance) {
      this.listLoading = true
      if (this.checkRequired() === true) {
        const params = {
          'distance': distance,
          'legId': legId
        }
        updateHistory(params).then(res => {
          this.listLoading = false
          if (res.status === 200) {
            this.dialogFormVisible = false
            this.value = 0
            this.form.legId = ''
            this.form.portNameFrom = ''
            this.form.portNameTo = ''
            this.form.distance = ''
            this.getPortsList()
          }
        })
      } else {
        this.getPortsList()
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    // 导出distance
    getDistance() {
      distanceDownload()
    },
    // 搜索
    onClearCondition() {
      this.currentPage = 1
      this.form.portNameSearch = ''
      this.totalList = []
      this.totalList = this.tempList
      this.filterList = []
      this.totalSize = this.totalList.length
      this.pageList.length = 0
      if (this.totalSize <= this.pageSize) {
        this.pageSize = this.totalSize
      }
      this.getPageList(this.totalList)
      this.pageSize = this.num
      this.portsList = this.pageList
    },
    onEnterSearch() {
      this.onSearchOrder()
    },
    onSearchOrder() {
      this.filterList = this.tempList
      this.totalList = []
      // for (let i = 0; i < this.filterList.length; i++) {
      //   if (this.form.portNameSearch.indexOf(this.filterList[i].portNameFrom) !== -1) {
      //     this.totalList.push(this.filterList[i])
      //   }
      // }
      this.totalList = fuzzyQueryPorts(this.filterList, 'portNameFrom', this.form.portNameSearch)
      this.totalSize = this.totalList.length
      this.pageList = []
      this.currentPage = 1
      if (this.totalSize <= this.pageSize) {
        this.pageSize = this.totalSize
      }
      this.portsList = []
      this.getPageList(this.totalList)
      this.pageSize = this.num
      this.portsList = this.pageList
      this.filterList = []
    },
    onSearchExact() {
      this.filterList = this.tempList
      this.totalList = []
      for (let i = 0; i < this.filterList.length; i++) {
        if (this.form.portNameSearch.indexOf(this.filterList[i].portNameFrom) !== -1) {
          this.totalList.push(this.filterList[i])
        }
      }
      // this.totalList = findarrays(this.filterList, 'portNameFrom', this.form.portNameSearch)
      this.totalSize = this.totalList.length
      this.pageList.length = 0
      for (let i = (this.currentPage - 1) * this.pageSize; i < (this.currentPage * this.pageSize); i++) {
        this.pageList.push(this.totalList[i])
      }
      this.portsList = this.pageList
      this.filterList = []
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      const arr = []
      for (const key in this.multipleSelection) {
        arr.push(this.multipleSelection[key]['legId'])
      }
      this.batchPortId = arr.toString()
    },
    toggleSelection() {
      this.$refs.multipleTable.clearSelection()
    },
    delArray() {
      this.$confirm('确定要删除这些数据吗?', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      })
        .then(() => {
          this.onDeleteBatch()
        })
        .catch(action => {
        })
    },
    onDeleteBatch() {
      if (this.checkBatch() === true) {
        const params = {
          'legIds': this.batchPortId
        }
        hDeleteBatch(params).then(res => {
          this.listLoading = false
          if (res.status === 200) {
            this.$message.success(res.data.header.msg)
            this.batchPortId = []
            this.getPortsList()
          }
        })
      }
    },
    operationClick(row, operationType) {
      if (operationType === 0) {
        this.dialogFormVisible = true
        this.form.legId = row.legId
        this.form.portNameFrom = row.portNameFrom
        this.form.portNameTo = row.portNameTo
        this.form.distance = row.distance
      } else {
        this.deletePortId = row.legId
        this.deleteAlert()
      }
    },
    deleteAlert() {
      this.$confirm('Are you sure to delete data?', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      })
        .then(() => {
          this.onRemovePort()
        })
        .catch(action => {
        })
    },
    onRemovePort() {
      const params = {
        'legId': this.deletePortId
      }
      deleteHistory(params).then(res => {
        this.listLoading = false
        if (res.status === 200) {
          this.$message.success(res.data.header.msg)
          this.deletePortId = []
          this.getPortsList()
        }
      })
    },
    updateCancel() {
      this.dialogFormVisible = false
      this.listLoading = false
      this.form.legId = ''
      this.form.portNameFrom = ''
      this.form.portNameTo = ''
      this.form.distance = ''
    },
    checkRequired() {
      let result = true
      if (this.form.distance === '') {
        this.$message.error('Distance is required')
        result = false
      }
      return result
    },
    checkBatch() {
      let result = true
      if (this.batchPortId === '') {
        this.$message.error('你没有选中任何选项')
        result = false
      }
      return result
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.pageList.length = 0
      this.totalSize = 0
      this.listLoading = true
      this.totalSize = this.totalList.length
      if (parseInt(this.totalSize / this.num) === (val - 1)) {
        this.pageSize = this.totalSize % this.num
        for (let i = (this.currentPage - 1) * this.num; i < (this.totalSize); i++) {
          this.pageList.push(this.totalList[i])
        }
      } else {
        this.getPageList(this.totalList)
      }
      this.pageSize = this.num
      this.portsList = this.pageList
      this.listLoading = false
    },
    getPortsList() {
      this.currentPage = 1
      this.listLoading = true
      this.totalList = []
      this.tempList = []
      this.portsList.length = 0
      getPorts().then(res => {
        this.listLoading = false
        if (res.data) {
          this.totalList = res.data.data.list
          this.tempList = this.totalList
          this.totalSize = res.data.data.list.length
          if (this.totalSize <= this.pageSize) {
            this.pageSize = this.totalSize
          }
          this.getPageList(this.totalList)
          this.pageSize = this.num
          this.portsList = this.pageList
        }
        this.listLoading = false
      })
    },
    // 假分页
    getPageList(list) {
      for (let i = (this.currentPage - 1) * this.pageSize; i < (this.currentPage * this.pageSize); i++) {
        this.pageList.push(list[i])
      }
    }
  }
}
</script>

<style scoped>
  .hr{
    height: 1PX;
    border: none;
    background-color: #0070B9;
    margin-bottom: 20px;
  }
.btn_div{
  margin-left: 30px;
  margin-top: 30px;
}
.table_div{
  margin-left: 40px;
  margin-top: 10px;
  min-height: calc(100% - 72px);
}
.bottom_div{
  text-align: center;
  background-color:#F7F7F7 ;
  padding: 12px ;
  font-size: 12px;
}
.root_div{
  height: 100%;
  width: 100%;
}
.optionBtn {
  margin: 10px 0px 0 10px;
  background-color: #FFD100;
  color: #0070B9;
}
  .deleteBtn{
    float: left;
    margin-left: 50px;
  }
  .cancelBtn{
    margin-left: 20px;
  }
.optionBtn:hover {
  color: #0070B9 !important;
  background-color: #fff !important;
  border-color: #0070B9;
}
  .el-form-item {
    margin-bottom: 7px;
  }
</style>
