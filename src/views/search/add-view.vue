<template>
  <div class="main-content">
    <div class="search-con">
      <div class="option">
        <a-button @click="goBack" type="text"
          ><template #icon>
            <icon-left />
          </template>
          返回</a-button
        >
        <div class="title">{{isView?'查看线索':'新增线索'}}</div>
      </div>

      <div class="table-con">
        <a-form
          ref="formRef"
          size="small"
          :model="form"
          style="width: 800px"
          @submit="handleSubmit"
        >
          <a-form-item field="xsbt" label="标题名称">
            <a-input
              v-model="form.xsbt"
              placeholder="请输入"
              :disabled="isView"
            />
          </a-form-item>
          <a-form-item field="ywzm"  label="线索编码">
            <a-input v-model="form.ywzm" placeholder="请输入" :disabled='true' />
          </a-form-item>
          <a-form-item field="zzlsh" label="流水号">
            <a-input v-model="form.zzlsh" placeholder="请输入"  :disabled='true' />
          </a-form-item>
          <a-form-item field="xslx" label="线索类型">
            <a-select v-model="form.xslx" placeholder="请选择" :disabled="isView">
              <a-option value="常规">常规</a-option>
              <a-option value="贩枪">贩枪</a-option>
              <a-option value="逃犯">逃犯</a-option>
              <a-option value="新型">新型</a-option>
            </a-select>
          </a-form-item>
           <a-form-item field="type" label="线索来源">
            <a-select v-model="form.type" placeholder="请选择" :disabled="isView">
              <a-option :value="item.code" v-for="item in XSLYList" :key="item.code+'type'">{{item.code}}-{{item.data}}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="xsgk" label="线索公开" >
            <a-select v-model="form.xsgk" placeholder="请选择" :disabled="isView">
              <a-option value="1">公开</a-option>
              <a-option value="0">私密</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="xsjb" label="线索级别">
            <a-select v-model="form.xsjb" placeholder="请选择" :disabled="isView"> 
              <a-option value="A">A</a-option>
              <a-option value="B">B</a-option>
              <a-option value="C">C</a-option>
              <a-option value="D">D</a-option>
            </a-select>
          </a-form-item>
          <a-form-item
            field="fywzm"
            v-if="form.fywzm && form.fywzm.length"
            label="父线索编码"
          >
            <a-input v-model="form.fywzm" placeholder="请输入"  :disabled="isView"/>
          </a-form-item>
          <a-form-item field="zywzm" label="线索串并">
            <a-button type="outline" @click="xshbClick" :disabled="isView">请选择</a-button>
          </a-form-item>
          <div
            style="margin-left: 120px; margin-bottom: 40px"
            v-if="form.zywzm &&  form.zywzm.length"
          >
            <div style="color: #4a4a4a">已选串并线索编码：{{ form.zywzm }}</div>
          </div>
          <!-- <a-form-item field="name" label="线索编号">
            <a-input v-model="form.name" placeholder="请输入" />
          </a-form-item>
          <a-form-item field="age" label="父线索编号">
            <a-input v-model="form.name" placeholder="请输入" />
          </a-form-item> -->
          <a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit" v-if="!isView">提交</a-button>
              <a-button style="margin-left: 20px" type="outline" @click="goBack"
                >取消</a-button
              >
              <!-- <a-button type="primary">线索拆分</a-button> -->
            </a-space>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <a-modal
      v-model:visible="visible"
      @cancel="handleCancel"
      :width="1000"
      :on-before-ok="handleBeforeOk"
      unmountOnClose
    >
      <template #title> 线索合并 </template>
      <div>
        <a-table
          :columns="columns"
          :pagination="false"
          :data="data"
          row-key="ywzm"
          :row-selection="rowSelection"
          v-model:selectedKeys="selectedKeys"
          :scroll="{ maxHeight: 600 }"
        />
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getZzlsh, getMergeAj, updateXs, getAjByYwzm,getXslyDictionary} from "@/assets/api/api";
import { useRouter } from "vue-router";
import { IconLeft } from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
const router = useRouter();
const goBack = () => {
  router.push({path:'/main-search'});
};
const selectedKeys = ref([]); //勾选的线索
const visible = ref(false);
const xshbClick = () => {
  getData();
  visible.value = true;
};
const XSLYList = ref([])
const form = ref({
  zzlsh: "", //流水号
  xslx: "", //线索类型
  xsbt: "", //线索标题,
  xsgk: "", //线索公开
  xsjb: "", //线索级别
  zywzm: "",
  fywzm: "",
  type: "",//线索来源
});
const getDetail = () => {
  const param = {
    ywzm:router.currentRoute.value.query.ywzm
  }
  getAjByYwzm(param).then((res) => {
    form.value = res.data
    for (let key in res.data){
      form[key] = res.data[key] || ""
    }
    form.value.xsgk = JSON.stringify(form.value.xsgk)
  });
};
if (router.currentRoute.value.query.fid) {
  form.value.fywzm = router.currentRoute.value.query.fid;
}
const isView = ref(false);


// const detailInfo = ref({})

const handleBeforeOk = async () => {
  console.log("selectedkeys", selectedKeys.value);
  form.value.zywzm = selectedKeys.value.join(",");
  // prevent close
  // return false;
};
const handleCancel = () => {
  selectedKeys.value = form.value.zywzm.split(",");
  visible.value = false;
};
const handleSubmit = ({ values, errors }) => {
  console.log("values:", values, "\nerrors:", errors);
  console.log("selectedkeys", selectedKeys.value);
  // cueCode X province 33 city 01 district 02 policeStation 510000 type 01
  // const param = {
  //   cueCode: "X",
  //   province: "33",
  //   city: "01",
  //   district: "02",
  //   policeStation: "510000",
    
  // };
  let param1 = JSON.parse(JSON.stringify(form.value));
  if (!param1.fywzm ||  param1.fywzm.length == 0) {
    param1.fywzm = null;
  }
  if (!param1.zywzm ||  param1.zywzm.length == 0) {
    param1.zywzm = null;
  }
  updateXs(param1).then((res) => {
    console.log("res", res);
    Message.success("保存成功");
    setTimeout(() => {
      router.go(-1);
    }, 1000);
  });
};

const getLSH = () => {
  getZzlsh().then((res) => {
    console.log("res", res);
    form.value.zzlsh = res.data.zzlsh;
    form.value.ywzm = res.data.ywzm
  });
 
};
const getXslyList = ()=>{
 getXslyDictionary().then(res=>{
     XSLYList.value = res.data
  })
}
const columns = ref([
  {
    title: "线索编码",
    dataIndex: "ywzm",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "线索标题",
    dataIndex: "xsbt",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "线索类型",
    dataIndex: "xslx",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "线索公开",
    dataIndex: "xsgk",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "线索级别",
    dataIndex: "xsjb",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "线索来源",
    dataIndex: "typeTitle",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "父线索编码",
    dataIndex: "fywzm",
    ellipsis: true,
    tooltip: true,
  },
]);
const rowSelection = ref({
  type: "checkbox",
  showCheckedAll: true,
  onlyCurrent: false,
});
const data = ref([]);
const getData = () => {
  const param = {
    pageNum: 1,
    pageSize: 1000,
    isSubmit:'SUBMIT'
  };
  getMergeAj(param)
    .then((res) => {
      console.log("aaa", res);
      data.value = res.data.records;
    })
    .catch((error) => {
      console.log("aaa", error);
    });
};
if (router.currentRoute.value.query.view == 1) {
  isView.value = true;
  getDetail();
}else{
  getLSH();
}
getXslyList()
</script>

<style lang='less' scoped>
.main-content {
  background-color: "var(--color-fill-2)";
  .search-con {
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    .search-result {
      // margin-top: 15px;
    }
  }
  .table-con {
    margin-top: 20px;
  }
}
.option {
  display: flex;
  align-items: center;
  .title {
    margin-left: 20px;
    font-size: 16px;
  }
}
</style>