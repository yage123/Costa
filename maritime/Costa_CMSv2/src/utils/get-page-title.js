import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Admin Template'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    // 标签页名称
    // return `${pageTitle} - ${title}`
  }
  return `${title}`
}
