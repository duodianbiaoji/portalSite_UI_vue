import request from '@/utils/request'

export function reviewShare(id, form) {
  const data = {
    id: id,
    reviewstatus: form.reviewstatus,
    reviewComment: form.reviewComment
  }
  return request({
    url: 'knowledgeShare/reviewKnlgeShare',
    method: 'post',
    data: data
  })
}

export function getKnlgeShareDetail({ articleid, type }) {
  return request({
    url: 'knowledgeShare/getKnlgeShareDetail',
    method: 'get',
    params: {
      articleid,
      type
    }
  })
}

export function del(id) {
  const data = {
    id: id
  }
  return request({
    url: 'comment/deleteComment',
    method: 'post',
    data: data
  })
}

export default { del }
