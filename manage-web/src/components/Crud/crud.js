import { initData, initDataByPost } from '@/api/data'
import Vue from 'vue'

/**
 * CRUD配置
 * @author Bai Xuepeng
 * @param {*} options <br>
 * @return crud instance.
 */
function CRUD(options) {
  const defaultOptions = {
    title: '',
    url: '',
    data: [],
    requestType: 'get',
    selections: [],
    query: {},
    params: {},
    form: {},
    defaultForm: () => {},
    time: 50,
    crudMethod: {
      add: (form) => {},
      delete: (id) => {},
      edit: (form) => {},
      get: (id) => {}
    },
    optShow: {
      add: true,
      edit: true,
      del: true,
      refresh: true
    },
    props: {},
    queryOnPresenterCreated: true,
    debug: false
  }
  options = mergeOptions(defaultOptions, options)
  const data = {
    ...options,
    dataStatus: {},
    status: {
      add: CRUD.STATUS.NORMAL,
      edit: CRUD.STATUS.NORMAL,
      get cu() {
        if (this.add === CRUD.STATUS.NORMAL && this.edit === CRUD.STATUS.NORMAL) {
          return CRUD.STATUS.NORMAL
        } else if (this.add === CRUD.STATUS.PREPARED || this.edit === CRUD.STATUS.PREPARED) {
          return CRUD.STATUS.PREPARED
        } else if (this.add === CRUD.STATUS.PROCESSING || this.edit === CRUD.STATUS.PROCESSING) {
          return CRUD.STATUS.PROCESSING
        }
        throw new Error('wrong crud\'s cu status')
      },
      get title() {
        return this.add > CRUD.STATUS.NORMAL ? `新增${crud.title}` : this.edit > CRUD.STATUS.NORMAL ? `编辑${crud.title}` : crud.title
      }
    },
    msg: {
      submit: '提交成功',
      add: '新增成功',
      edit: '编辑成功',
      del: '删除成功'
    },
    page: {
      page: 1,
      size: 10,
      total: 0
    },
    loading: true,
    delAllLoading: false
  }
  const methods = {
    submitSuccessNotify() {
      crud.notify(crud.msg.submit, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    addSuccessNotify() {
      crud.notify(crud.msg.add, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    editSuccessNotify() {
      crud.notify(crud.msg.edit, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    delSuccessNotify() {
      crud.notify(crud.msg.del, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    toQuery() {
      crud.page.page = 1
      crud.refresh()
    },
    refresh() {
      if (!callVmHook(crud, CRUD.HOOK.beforeRefresh)) {
        return
      }
      return new Promise((resolve, reject) => {
        crud.loading = true
        const getUrl = crud.requestType === 'get' ? initData : initDataByPost
        getUrl(crud.url, crud.getQueryParams()).then(data => {
          crud.page.total = data.page.total
          crud.data = data.value
          crud.resetDataStatus()
          setTimeout(() => {
            crud.loading = false
            callVmHook(crud, CRUD.HOOK.afterRefresh)
          }, crud.time)
          resolve(data)
        }).catch(err => {
          crud.loading = false
          reject(err)
        })
      })
    },
    toAdd() {
      if (!(callVmHook(crud, CRUD.HOOK.beforeToAdd, crud.form) && callVmHook(crud, CRUD.HOOK.beforeToCU, crud.form))) {
        return
      }
      crud.status.add = CRUD.STATUS.PREPARED
      callVmHook(crud, CRUD.HOOK.afterToAdd, crud.form)
      callVmHook(crud, CRUD.HOOK.afterToCU, crud.form)
    },
    toEdit(data) {
      crud.resetForm(JSON.parse(JSON.stringify(data)))
      if (!(callVmHook(crud, CRUD.HOOK.beforeToEdit, crud.form) && callVmHook(crud, CRUD.HOOK.beforeToCU, crud.form))) {
        return
      }
      crud.status.edit = CRUD.STATUS.PREPARED
      crud.getDataStatus(data.id).edit = CRUD.STATUS.PREPARED
      callVmHook(crud, CRUD.HOOK.afterToEdit, crud.form)
      callVmHook(crud, CRUD.HOOK.afterToCU, crud.form)
    },
    toDelete(data) {
      crud.getDataStatus(data.id).delete = CRUD.STATUS.PREPARED
    },
    cancelDelete(data) {
      if (!callVmHook(crud, CRUD.HOOK.beforeDeleteCancel, data)) {
        return
      }
      crud.getDataStatus(data.id).delete = CRUD.STATUS.NORMAL
      callVmHook(crud, CRUD.HOOK.afterDeleteCancel, data)
    },
    cancelCU() {
      const addStatus = crud.status.add
      const editStatus = crud.status.edit
      if (addStatus === CRUD.STATUS.PREPARED) {
        if (!callVmHook(crud, CRUD.HOOK.beforeAddCancel, crud.form)) {
          return
        }
        crud.status.add = CRUD.STATUS.NORMAL
      }
      if (editStatus === CRUD.STATUS.PREPARED) {
        if (!callVmHook(crud, CRUD.HOOK.beforeEditCancel, crud.form)) {
          return
        }
        crud.status.edit = CRUD.STATUS.NORMAL
        crud.getDataStatus(crud.form.id).edit = CRUD.STATUS.NORMAL
      }
      crud.resetForm()
      if (addStatus === CRUD.STATUS.PREPARED) {
        callVmHook(crud, CRUD.HOOK.afterAddCancel, crud.form)
      }
      if (editStatus === CRUD.STATUS.PREPARED) {
        callVmHook(crud, CRUD.HOOK.afterEditCancel, crud.form)
      }
      if (crud.findVM('form').$refs['form']) {
        crud.findVM('form').$refs['form'].clearValidate()
      }
    },
    submitCU() {
      if (!callVmHook(crud, CRUD.HOOK.beforeValidateCU)) {
        return
      }
      crud.findVM('form').$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        if (!callVmHook(crud, CRUD.HOOK.afterValidateCU)) {
          return
        }
        if (crud.status.add === CRUD.STATUS.PREPARED) {
          crud.doAdd()
        } else if (crud.status.edit === CRUD.STATUS.PREPARED) {
          crud.doEdit()
        }
      })
    },
    doAdd() {
      if (!callVmHook(crud, CRUD.HOOK.beforeSubmit)) {
        return
      }
      crud.status.add = CRUD.STATUS.PROCESSING
      crud.crudMethod.add(crud.form).then(() => {
        crud.status.add = CRUD.STATUS.NORMAL
        crud.resetForm()
        crud.addSuccessNotify()
        callVmHook(crud, CRUD.HOOK.afterSubmit)
        crud.toQuery()
      }).catch(() => {
        crud.status.add = CRUD.STATUS.PREPARED
        callVmHook(crud, CRUD.HOOK.afterAddError)
      })
    },
    doEdit() {
      if (!callVmHook(crud, CRUD.HOOK.beforeSubmit)) {
        return
      }
      crud.status.edit = CRUD.STATUS.PROCESSING
      crud.crudMethod.edit(crud.form).then(() => {
        crud.status.edit = CRUD.STATUS.NORMAL
        crud.getDataStatus(crud.form.id).edit = CRUD.STATUS.NORMAL
        crud.editSuccessNotify()
        crud.resetForm()
        callVmHook(crud, CRUD.HOOK.afterSubmit)
        crud.refresh()
      }).catch(() => {
        crud.status.edit = CRUD.STATUS.PREPARED
        callVmHook(crud, CRUD.HOOK.afterEditError)
      })
    },
    doDelete(data) {
      let delAll = false
      let dataStatus
      const ids = []
      if (data instanceof Array) {
        delAll = true
        data.forEach(val => {
          ids.push(val.id)
        })
      } else {
        ids.push(data.id)
        dataStatus = crud.getDataStatus(data.id)
      }
      if (!callVmHook(crud, CRUD.HOOK.beforeDelete, data)) {
        return
      }
      if (!delAll) {
        dataStatus.delete = CRUD.STATUS.PROCESSING
      }
      return crud.crudMethod.del(ids).then(() => {
        if (delAll) {
          crud.delAllLoading = false
        } else dataStatus.delete = CRUD.STATUS.PREPARED
        crud.dleChangePage(1)
        crud.delSuccessNotify()
        callVmHook(crud, CRUD.HOOK.afterDelete, data)
        crud.refresh()
      }).catch(() => {
        if (delAll) {
          crud.delAllLoading = false
        } else dataStatus.delete = CRUD.STATUS.PREPARED
      })
    },
    getQueryParams: function() {
      return {
        current: crud.page.page,
        pageSize: crud.page.size,
        ...crud.query,
        ...crud.params
      }
    },
    pageChangeHandler(e) {
      crud.page.page = e
      crud.refresh()
    },
    sizeChangeHandler(e) {
      crud.page.size = e
      crud.page.page = 1
      crud.refresh()
    },
    dleChangePage(size) {
      if (crud.data.length === size && crud.page.page !== 1) {
        crud.page.page -= 1
      }
    },
    selectionChangeHandler(val) {
      crud.selections = val
    },
    resetQuery(toQuery = true) {
      const defaultQuery = JSON.parse(JSON.stringify(crud.defaultQuery))
      const query = crud.query
      Object.keys(query).forEach(key => {
        query[key] = defaultQuery[key]
      })
      if (toQuery) {
        crud.toQuery()
      }
    },
    resetForm(data) {
      const form = data || (typeof crud.defaultForm === 'object' ? JSON.parse(JSON.stringify(crud.defaultForm)) : crud.defaultForm())
      const crudFrom = crud.form
      for (const key in form) {
        if (crudFrom.hasOwnProperty(key)) {
          crudFrom[key] = form[key]
        } else {
          Vue.set(crudFrom, key, form[key])
        }
      }
    },
    resetDataStatus() {
      const dataStatus = {}
      function resetStatus(datas) {
        datas.forEach(e => {
          dataStatus[e.id] = {
            delete: 0,
            edit: 0
          }
          if (e.children) {
            resetStatus(e.children)
          }
        })
      }
      resetStatus(crud.data)
      crud.dataStatus = dataStatus
    },
    getDataStatus(id) {
      return crud.dataStatus[id]
    },
    findVM(type) {
      return crud.vms.find(vm => vm && vm.type === type).vm
    },
    notify(title, type = CRUD.NOTIFICATION_TYPE.INFO) {
      crud.vms[0].vm.$notify({
        title,
        type,
        duration: 2500
      })
    },
    updateProp(name, value) {
      Vue.set(crud.props, name, value)
    }
  }
  const crud = Object.assign({}, data)
  Vue.observable(crud)
  Object.assign(crud, methods)
  Object.assign(crud, {
    defaultQuery: JSON.parse(JSON.stringify(data.query)),
    vms: Array(4),
    registerVM(type, vm, index = -1) {
      const vmObj = {
        type,
        vm: vm
      }
      if (index < 0) {
        this.vms.push(vmObj)
        return
      }
      this.vms.length = Math.max(this.vms.length, index)
      this.vms.splice(index, 1, vmObj)
    },
    unregisterVM(vm) {
      this.vms.splice(this.vms.findIndex(e => e && e.vm === vm), 1)
    }
  })
  Object.freeze(crud)
  return crud
}

function callVmHook(crud, hook) {
  if (crud.debug) {
    console.log('callVmHook: ' + hook)
  }
  let ret = true
  const nargs = [crud]
  for (let i = 2; i < arguments.length; ++i) {
    nargs.push(arguments[i])
  }
  const vmSet = new Set()
  crud.vms.forEach(vm => vm && vmSet.add(vm.vm))
  vmSet.forEach(vm => {
    if (vm[hook]) {
      ret = vm[hook].apply(vm, nargs) !== false && ret
    }
  })
  return ret
}

function mergeOptions(src, opts) {
  const optsRet = {
    ...src
  }
  for (const key in src) {
    if (opts.hasOwnProperty(key)) {
      optsRet[key] = opts[key]
    }
  }
  return optsRet
}

function presenter(crud) {
  return {
    inject: ['crud'],
    beforeCreate() {
      this._provided = {
        crud,
        'crud.query': crud.query,
        'crud.page': crud.page,
        'crud.form': crud.form
      }
    },
    created() {
      this.crud.registerVM('presenter', this, 0)
      if (crud.queryOnPresenterCreated) {
        crud.toQuery()
      }
    },
    beforeDestroy() {
      this.crud.unregisterVM(this)
    }
  }
}

function header() {
  return {
    inject: {
      crud: {
        from: 'crud'
      },
      query: {
        from: 'crud.query'
      }
    },
    created() {
      this.crud.registerVM('header', this, 1)
    },
    beforeDestroy() {
      this.crud.unregisterVM(this)
    }
  }
}

function pagination() {
  return {
    inject: {
      crud: {
        from: 'crud'
      },
      page: {
        from: 'crud.page'
      }
    },
    created() {
      this.crud.registerVM('pagination', this, 2)
    },
    beforeDestroy() {
      this.crud.unregisterVM(this)
    }
  }
}

function form(defaultForm) {
  return {
    inject: {
      crud: {
        from: 'crud'
      },
      form: {
        from: 'crud.form'
      }
    },
    created() {
      this.crud.registerVM('form', this, 3)
      this.crud.defaultForm = defaultForm
      this.crud.resetForm()
    },
    beforeDestroy() {
      this.crud.unregisterVM(this)
    }
  }
}

function crud(options = {}) {
  const defaultOptions = {
    type: undefined
  }
  options = mergeOptions(defaultOptions, options)
  return {
    inject: {
      crud: {
        from: 'crud'
      }
    },
    created() {
      this.crud.registerVM(options.type, this)
    },
    beforeDestroy() {
      this.crud.unregisterVM(this)
    }
  }
}

CRUD.HOOK = {
  beforeRefresh: 'beforeCrudRefresh',
  afterRefresh: 'afterCrudRefresh',
  beforeDelete: 'beforeCrudDelete',
  afterDelete: 'afterCrudDelete',
  beforeDeleteCancel: 'beforeCrudDeleteCancel',
  afterDeleteCancel: 'afterCrudDeleteCancel',
  beforeToAdd: 'beforeCrudToAdd',
  afterToAdd: 'afterCrudToAdd',
  beforeToEdit: 'beforeCrudToEdit',
  afterToEdit: 'afterCrudToEdit',
  beforeToCU: 'beforeCrudToCU',
  afterToCU: 'afterCrudToCU',
  beforeValidateCU: 'beforeCrudValidateCU',
  afterValidateCU: 'afterCrudValidateCU',
  beforeAddCancel: 'beforeCrudAddCancel',
  afterAddCancel: 'afterCrudAddCancel',
  beforeEditCancel: 'beforeCrudEditCancel',
  afterEditCancel: 'afterCrudEditCancel',
  beforeSubmit: 'beforeCrudSubmitCU',
  afterSubmit: 'afterCrudSubmitCU',
  afterAddError: 'afterCrudAddError',
  afterEditError: 'afterCrudEditError'
}

CRUD.STATUS = {
  NORMAL: 0,
  PREPARED: 1,
  PROCESSING: 2
}

CRUD.NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error'
}

export default CRUD

export {
  presenter,
  header,
  form,
  pagination,
  crud
}
