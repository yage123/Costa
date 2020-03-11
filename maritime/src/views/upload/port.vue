<template>
  <div class="root_div">
    <el-container>
      <el-header height="10px" />
      <el-main>
        <div class="table_div">
          <el-form ref="form" :model="form">
            <el-row style="height: 40px">
              <el-col class="filter-form-el-col" :offset="2" :md="18" :sm="24" :xs="24">
                <el-form-item label="港口或地区关键字:" style="text-align: center">
                  <el-row style="margin-left: 120px">
                    <el-input v-model="form.portNameSearch" placeholder="Please enter portname！" @keyup.enter.native="onEnterSearch" />
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="filter-form-el-col" :offset="2" :md="18" :sm="24" :xs="24">
                <el-form-item label="可靠港船只:" style="text-align: center">
                  <el-row style="float: left;margin-left: 40px">
<!--                    <el-input v-model="form.shipSearch" placeholder="Please Select Ship！" @keyup.enter.native="onEnterSearch" />-->
                    <el-select v-model="calledShip" multiple placeholder="Please Select" style="width: 320px">
                      <el-option label="NR" :value="nr" />
                      <el-option label="AT" :value="at" />
                      <el-option label="SE" :value="se" />
                      <el-option label="VE" :value="ve" />
                      <el-option label="FI" :value="fi" />
                      <el-option label="ME" :value="me" />
                    </el-select>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="end">
              <el-col :md="22" style="text-align: right">
                <el-button size="small" type="primary" class="searchBtn" @click="onSearchOrder(calledShip)">Search</el-button>
                <!--                <el-button size="small" type="primary" class="searchBtn" @click="onSearchExact()">精准匹配</el-button>-->
                <el-button size="small" type="primary" plain class="clearBtn" @click="onClearCondition()">Clear Condition</el-button>
              </el-col>
            </el-row>
            <hr :span="24" class="hr">
            <el-row>
              <el-button size="small" class="deleteBtn" @click="delArray()" type="danger">批量删除</el-button>
              <el-button size="small" type="primary" class="cancelBtn" @click="toggleSelection()">取消选择</el-button>
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
            >
              <el-table-column type="selection" align="center" />
              <el-table-column label="序号">
                <template scope="scope">
                  <span>{{(currentPage - 1) *num + scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="portName" label="港口名字" />
              <el-table-column prop="countryOrArea" label="国家/地区" />
              <el-table-column prop="shipCanCall" label="可靠港船只" />
              <el-table-column prop="maxTime" label="港口到引水站时间(小时)" />
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
                :page-size="pageSize"
                :current-page="currentPage"
                layout="total,prev,pager,next,jumper"
                :total="totalSize"
                @current-change="handleCurrentChange"
              />
            </el-row>
            <el-dialog :visible.sync="dialogFormVisible" :before-close="updateCancel">
              <el-form label-width="120px" :model="portsform">
                <el-form-item label="Leg No:" required="true">
                  <el-input v-model="form.portId" :disabled="true" placeholder="Please Enter Staff No" />
                </el-form-item>
                <el-form-item label="港口名字:" required="true">
                  <el-input v-model="form.portName" placeholder="Please Enter User Name" :disabled="true" />
                </el-form-item>
                <el-form-item label="国家/地区:" required="true">
                  <el-input v-model="form.countryOrArea" placeholder="Please Enter Name" :disabled="true" />
                </el-form-item>
                <el-form-item label="可靠港船只:" required="true">
                  <el-select v-model="ships" multiple placeholder="Please Select" style="width: 95%">
                    <el-option label="NR" :value="nr" />
                    <el-option label="AT" :value="at" />
                    <el-option label="SE" :value="se" />
                    <el-option label="VE" :value="ve" />
                    <el-option label="FI" :value="fi" />
                    <el-option label="ME" :value="me" />
                  </el-select>
                </el-form-item>
                <el-form-item label="港口到引水站时间(小时):" required="true">
                  <el-input v-model="form.maxTime" placeholder="Please Enter Password" />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click.native="updateCancel">cancel</el-button>
                <el-button type="primary" @click.native="handleUpdate(form.portId,form.portName,form.countryOrArea,ships,form.maxTime)">ok</el-button>
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
import { getPort, updatePort, deletePort, pDeleteBatch } from '../../api/port'
import { fuzzyQuery, fuzzyQueryShip } from '../../api'

export default {
  name: 'Account',
  data() {
    return {
      portsList: [],
      calledShip: [],
      multipleSelection: [],
      nr: 'NR',
      at: 'AT',
      se: 'SE',
      ve: 'VE',
      fi: 'FI',
      me: 'ME',
      portsform: {},
      form: {
        portId: '',
        portName: '',
        maxTime: '',
        countryOrArea: '',
        shipCanCall: '',
        portNameSearch: '',
        areaSearch: '',
        shipSearch: ''
      },
      filterList: [],
      listLoading: false,
      dialogFormVisible: false,
      pageList: [],
      currentPage: 1,
      pageSize: 50,
      num: 50,
      totalSize: 0,
      totalList: [],
      ships: [],
      tempList: [],
      deletePortId: '',
      batchPortId: '',
      list: ['11123', '1245632', '1225673', '128223', '1234823']
    }
  },
  created() {
    this.getPortList()
  },
  methods: {
    handleUpdate(portId, portName, countryOrArea, shipCanCall, maxTime) {
      this.listLoading = true
      const shipCall = shipCanCall.toString()
      if (this.checkRequired() === true) {
        const params = {
          'operationalTime': maxTime,
          'portId': portId,
          'portName': portName,
          'countryOrArea': countryOrArea,
          'shipCanCall': shipCall
        }
        updatePort(params).then(res => {
          this.listLoading = false
          if (res.status === 200) {
            this.dialogFormVisible = false
            this.form.portId = ''
            this.form.portName = ''
            this.form.maxTime = ''
            this.form.countryOrArea = ''
            this.form.shipCanCall = ''
            this.ships = []
            this.getPortList()
          }
        })
      } else {
        this.getPortList()
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      const arr = []
      for (const key in this.multipleSelection) {
        arr.push(this.multipleSelection[key]['portId'])
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
          'portIds': this.batchPortId
        }
        pDeleteBatch(params).then(res => {
          this.listLoading = false
          if (res.status === 200) {
            this.$message.success(res.data.header.msg)
            this.batchPortId = []
            this.getPortList()
          }
        })
      }
    },
    checkBatch() {
      let result = true
      if (this.batchPortId === '') {
        this.$message.error('你没有选中任何选项')
        result = false
      }
      return result
    },
    checkRequired() {
      let result = true
      if (this.form.portId === '') {
        this.$message.error('portId is required')
        result = false
      }
      if (this.form.portName === '') {
        this.$message.error('portName is required')
        result = false
      }
      if (this.form.maxTime === '') {
        this.$message.error('maxTime is required')
        result = false
      }
      if (this.form.countryOrArea === '') {
        this.$message.error('countryOrArea is required')
        result = false
      }
      if (this.form.shipCanCall === '') {
        this.$message.error('shipCanCall is required')
        result = false
      }
      return result
    },
    // 搜索
    onClearCondition() {
      this.currentPage = 1
      this.form.portNameSearch = ''
      this.calledShip = []
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
    onSearchOrder(shipCancall) {
      this.filterList = this.tempList
      this.totalList = []
      this.totalList = fuzzyQuery(this.filterList, 'countryOrArea', this.form.portNameSearch)
      // this.totalList = fuzzyQueryPort(this.totalList, 'shipCanCall', shipCall)
      this.totalList = fuzzyQueryShip(this.totalList, shipCancall)
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
    operationClick(row, operationType) {
      if (operationType === 0) {
        this.dialogFormVisible = true
        this.form.portId = row.portId
        this.form.portName = row.portName
        this.form.maxTime = row.maxTime
        this.form.countryOrArea = row.countryOrArea
        this.form.shipCanCall = row.shipCanCall
        this.ships = this.getShip(row.shipCanCall)
      } else {
        this.deletePortId = row.portId
        this.deleteAlert()
      }
    },
    getShip(data) {
      const ship = data.split(',')
      return ship
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
        'portId': this.deletePortId
      }
      deletePort(params).then(res => {
        this.listLoading = false
        if (res.status === 200) {
          this.deletePortId = []
          this.$message.success(res.data.header.msg)
          this.getPortList()
        }
      })
    },
    updateCancel() {
      this.dialogFormVisible = false
      this.listLoading = false
      this.form.portId = ''
      this.form.portName = ''
      this.form.maxTime = ''
      this.form.countryOrArea = ''
      this.form.shipCanCall = ''
      this.ships = []
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.pageList.length = 0
      this.totalSize = 0
      this.totalSize = this.totalList.length
      this.listLoading = true
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
    async getPortList() {
      this.currentPage = 1
      this.listLoading = true
      this.totalList = []
      this.tempList = []
      this.portsList.length = 0
      getPort().then(res => {
        this.listLoading = false
        if (res.data) {
          this.totalList = res.data.data.list
          this.totalSize = res.data.data.list.length
          this.tempList = this.totalList
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

.optionBtn:hover {
  color: #0070B9 !important;
  background-color: #fff !important;
  border-color: #0070B9;
}
.deleteBtn{
  float: left;
  margin-left: 50px;
}
.cancelBtn{
  margin-left: 20px;
}
.hr{
  height: 1PX;
  border: none;
  background-color: #0070B9;
  margin-bottom: 20px;
}
.el-form-item {
  margin-bottom: 7px;
}
</style>
