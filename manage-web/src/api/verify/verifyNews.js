import request from '@/utils/request'

export function reviewNews(id, form) {
  const data = {
    id: id,
    reviewstatus: form.reviewstatus,
    reviewComment: form.reviewComment
  }
  return request({
    url: 'news/reviewNews',
    method: 'post',
    data: data
  })
}

export function getNewsDetail(newsid) {
  const params = {
    newsid: newsid
  }
  return request({
    url: 'news/getNewsDetail',
    method: 'get',
    params
  })
}
