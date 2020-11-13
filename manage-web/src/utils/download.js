// 文件下载
export function download(data, fileName) {
  if (!data) {
    return
  }
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)

  document.body.appendChild(link)
  link.click()
}
