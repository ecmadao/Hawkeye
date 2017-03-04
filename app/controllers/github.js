import User from '../models/users';
import Api from '../services/api';
import ShareAnalyse from '../models/share-analyse';
import getCacheKey from './helper/cacheKey';

/* ================== router handler ================== */

const toggleShare = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const { enable } = ctx.request.body;
  await ShareAnalyse.changeShareStatus({
    enable,
    url: `github/${githubLogin}`
  });
  const message = enable === 'true' ? "messages.share.toggleOpen" : "messages.share.toggleClose"
  ctx.body = {
    success: true,
    message: ctx.__(message)
  };
};

const getUser = async (ctx, next) => {
  const { githubLogin, githubToken, userId } = ctx.session;
  const user = await Api.getUser(githubLogin, githubToken);
  const login = user.login;
  const shareAnalyse = await ShareAnalyse.findShare({ login, url: `github/${login}` });

  const result = Object.assign({}, user);
  result.openShare = shareAnalyse.enable;
  result.shareUrl = `github/${login}?locale=${ctx.session.locale}`;
  return ctx.body = {
    success: true,
    result
  };
};

const getUserRepos = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  const { login } = ctx.query;
  const { repos, commits } = await Api.getUserRepos(login || githubLogin, githubToken);
  if (!commits.length || !repos.length) {
    ctx.query.shouldCache = false;
  }
  ctx.body = {
    success: true,
    result: {
      repos,
      commits
    }
  };
  await next();
};

const getUserOrgs = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session;
  const { login } = ctx.query;
  const orgs = await Api.getUserOrgs(login || githubLogin, githubToken);
  ctx.body = {
    success: true,
    result: {
      orgs
    }
  };
};

const getSharedUser = async (ctx, next) => {
  const { login } = ctx.params;
  const user = await Api.getUser(login);
  if (user) {
    return ctx.body = {
      success: true,
      result: user
    };
  }
  ctx.body = {
    success: true,
    error: ctx.__("messages.error.findUser")
  };
};

const sharePage = async (ctx, next) => {
  const { login } = ctx.params;
  const { githubLogin } = ctx.session;

  const shareAnalyse = await ShareAnalyse.findShare({ login, url: `github/${login}` });
  const user = await Api.getUser(login);

  if (!user || !shareAnalyse.enable) {
    ctx.redirect('/404');
    return;
  }
  const title = ctx.__("sharePage.github", user.name || user.login);

  if (!ctx.state.isMobile) {
    await ctx.render('user/share', {
      user: {
        login,
        isAdmin: login === githubLogin
      },
      title,
      shareText: ctx.__("messages.share.text")
    });
    return;
  }

  const {
    bio,
    name,
    created_at,
    avatar_url,
    public_repos,
    followers,
    following
  } = user;
  await ctx.render('user/mobile/share', {
    user: {
      bio,
      name: name || login,
      login,
      avatar_url,
      public_repos,
      followers,
      following,
      isAdmin: login === githubLogin,
      created_at: created_at.split('T')[0]
    },
    title,
    shareText: ctx.__("messages.share.mobileText"),
    joinAt: ctx.__("sharePage.joinAt"),
    menu: {
      shareDatas: ctx.__("mobilePage.menu.shareDatas"),
      githubAnalysis: ctx.__("mobilePage.menu.githubAnalysis"),
      dataRefresh: ctx.__("mobilePage.menu.dataRefresh"),
      logout: ctx.__("mobilePage.menu.logout"),
    }
  });
};

const getStareRecords = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const url = `github/${githubLogin}`;
  const shareAnalyse = await ShareAnalyse.findShare({ login: githubLogin, url });
  const { viewDevices, viewSources, pageViews, enable } = shareAnalyse;
  ctx.body = {
    success: true,
    result: {
      url: `${url}?locale=${ctx.session.locale}`,
      viewDevices,
      viewSources,
      pageViews,
      openShare: enable
    }
  };
};

const getUpdateTime = async (ctx, next) => {
  const { githubLogin } = ctx.session;
  const result = await Api.getUpdateTime(githubLogin);
  return ctx.body = {
    success: true,
    result
  };
};

const refreshDatas = async (ctx, next) => {
  const { githubToken, githubLogin } = ctx.session;

  const result = await Api.refreshUserDatas(githubLogin, githubToken);
  if (result === false) {
    return ctx.body = {
      success: true,
      error: ctx.__("messages.error.frequent")
    };
  }

  // set cache keys to remove
  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey('repos', {
      session: ['githubLogin']
    }),
    cacheKey('user', {
      session: ['githubLogin']
    }),
    cacheKey(`sharedUser.${githubLogin}`),
    cacheKey(`sharedInfo.${githubLogin}`)
  ];

  ctx.body = {
    success: true,
    message: ctx.__("messages.success.update"),
    result
  };

  await next();
};

const getZen = async (ctx) => {
  const result = await Api.getZen();
  ctx.body = {
    success: true,
    result
  }
};

const getOctocat = async (ctx) => {
  const result = await Api.getOctocat();
  ctx.body = {
    success: true,
    result
  }
};

export default {
  getUser,
  getSharedUser,
  sharePage,
  getUserRepos,
  getUserOrgs,
  toggleShare,
  getStareRecords,
  getUpdateTime,
  refreshDatas,
  getZen,
  getOctocat
}
