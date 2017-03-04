const datas = {
  sections: {
    hotmap: {
      title: '活跃度'
    },
    baseInfo: {
      title: '基本信息',
      joinedAt: '加入时间：'
    },
    social: {
      repositories: 'Repositories',
      followers: 'Followers',
      following: 'Following'
    },
    repos: {
      title: '仓库概览',
      starsCount: '收获 star 数',
      forksCount: '收获 fork 数',
      reposCount: '创建的仓库数',
      popularestRepos: '最受欢迎的仓库',
      maxStarPerRepos: '单个仓库最多 star 数',
      longgestRepos: '贡献时间最久的仓库',
      chartTitle: '仓库 fork/star/一年内 commits 数一览（取前十）',
      emptyText: '暂无仓库信息'
    },
    orgs: {
      title: '隶属组织',
      createdAt: '创建于 ',
      joinedRepos: '参与的公开项目',
      contributionPercentage: '贡献比例',
      emptyText: '暂无组织信息'
    },
    languages: {
      title: '编程语言',
      maxReposCountLanguage: '拥有最多的仓库',
      maxUsageLanguage: '最常使用的语言',
      maxStarLanguage: '拥有最多的 star',
      frequency: '语言使用频次',
      usageChart: {
        title: '语言使用频次',
        label: '占比：'
      },
      starChart: {
        title: '语言 & 获得 star',
        label: '与该语言相关 star 数：'
      },
      emptyText: '暂无语言信息'
    },
    commits: {
      title: '贡献信息',
      maxDay: '是你提交最多的日子',
      averageCount: '平均每周提交次数',
      firstCommit: '过去一年第一次提交代码',
      maxCommitRepos: '提交次数最多的仓库',
      maxCommitCount: '单个仓库最多提交数',
      dailyCommitChartTitle: '过去一年每日总提交数',
      weeklyCommitChartTitle: '过去一年单周提交数',
      emptyText: '暂无提交信息'
    }
  },
  modal: {
    shareText: '分享你的 GitHub 总结'
  },
  operations: {
    share: {
      show: '在分享中展示',
      hide: '不在分享中展示'
    }
  }
};

export default datas;
