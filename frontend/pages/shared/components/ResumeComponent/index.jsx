import React, { PropTypes } from 'react';
import cx from 'classnames';

import dateHelper from 'UTILS/date';
import { sortByX } from 'UTILS/helper';
import validator from 'UTILS/validator';
import { LINK_NAMES } from 'SHAREDPAGE/datas/resume';
import { objectassign } from 'SHAREDPAGE/utils/resume';
import GithubComponent from 'SHAREDPAGE/components/GithubComponent';
import styles from './styles/resume.css';

const sortByDate = sortByX('startTime');
const sortByEndDate = sortByX('endTime');
const validateDate = dateHelper.validator.date;
const getSecondsByDate = dateHelper.seconds.getByDate;
const getDateNow = dateHelper.date.now;

const DATE_NOW = getDateNow();
const DATE_NOW_SECONDS = getSecondsByDate(DATE_NOW);

const info = (options) => {
  const { text, icon, type } = options;
  const style = options.style || '';
  const component = options.component || null;

  return (
    <div className={cx(styles[`${type}_info`], style)}>
      <i className={cx(`fa fa-${icon}`, styles[`${type}_icon`])} aria-hidden="true"></i>
      &nbsp;&nbsp;
      {component ? component : text}
    </div>
  )
};

const baseInfo = (text, icon, options = {}) => {
  return info(objectassign({}, {
    text,
    icon,
    type: 'base',
    ...options
  }));
};

const titleInfo = (text, icon, options = {}) => {
  return info(objectassign({}, {
    text,
    icon,
    type: 'title',
    ...options
  }));
};

class ResumeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showGithub: false
    };
    this.changeShowGithub = this.changeShowGithub.bind(this);
  }

  changeShowGithub(showGithub) {
    this.setState({ showGithub });
  }

  renderEducations() {
    const { educations } = this.props.resume;
    if (!educations.length) { return }

    const edus = educations.sort(sortByDate).reverse().map((edu, index) => {
      const { school, major, education, startTime, endTime} = edu;
      if (!school) { return }
      return (
        <div key={index} className={styles["section_wrapper"]}>
          <div className={styles["info_header"]}>{school}{education ? `, ${education}` : ''}</div>
          <div className={styles["info_text"]}>{validateDate(startTime)}  ~  {validateDate(endTime)}</div>
          <div className={styles["info_text"]}>{major}</div>
          {/* <div className={styles["section_dot"]}></div> */}
        </div>
      )
    });

    return (
      <div className={styles["section"]}>
        {titleInfo('教育经历', 'university')}
        <div className={styles["info_timeline"]}>
          {edus}
        </div>
      </div>
    )
  }

  renderWorkExperiences() {
    const { workExperiences } = this.props.resume;
    if (!workExperiences.length) { return }

    const exps = workExperiences.sort(sortByDate).reverse().map((experience, index) => {
      const { company, url, startTime, endTime, position, projects } = experience;
      if (!company) { return }
      const workProjects = this.renderProjects(projects);
      return (
        <div key={index} className={styles["section_wrapper"]}>
          {validator.url(url) ? (
            <a target="_blank" href={url[0] === 'h' ? url : `//${url}`} className={cx(styles["info_header"], styles.link)}>
              <i className="fa fa-link" aria-hidden="true"></i>&nbsp;&nbsp;
              {company}
            </a>
          ) : (<div className={styles["info_header"]}>{company}</div>)}
          {position ? `, ${position}` : ''}
          <div className={styles["info_text"]}>{validateDate(startTime)}  ~  {validateDate(endTime)}</div>
          <div>{workProjects}</div>
          <div className={styles["section_dot"]}></div>
        </div>
      )
    });

    return (
      <div className={styles["section"]}>
        {titleInfo('工作经历', 'file-text-o')}
        <div className={styles["info_timeline"]}>
          {exps}
        </div>
      </div>
    )
  }

  renderProjects(projects) {
    return projects.map((project, index) => {
      const { name, details } = project;
      if (!name) { return }
      const projectDetails = details.map((detail, i) => {
        return (
          <li key={i}>
            {detail}
          </li>
        );
      });
      return (
        <div key={index} className={styles["project_section"]}>
          <div className={styles["info_section"]}>{name}</div>
          <ul className={styles["info_intro"]}>
            {projectDetails}
          </ul>
        </div>
      )
    });
  }

  renderPersonalProjects() {
    const { personalProjects } = this.props.resume;
    if (!personalProjects.length) { return }

    const projects = personalProjects.map((project, index) => {
      const { url, desc, techs, title } = project;
      const projectTechs = techs.map((tech, index) => {
        return (
          <div key={index} className={styles["info_label"]}>
            {tech}
          </div>
        );
      });
      return (
        <div key={index} className={styles["sec_section"]}>
          {validator.url(url) ? (
            <a target="_blank" href={url[0] === 'h' ? url : `//${url}`} className={cx(styles["info_header"], styles.link)}>
              <i className="fa fa-link" aria-hidden="true"></i>&nbsp;&nbsp;
              {title}
            </a>
          ) : (<div className={styles["info_header"]}>{title}</div>)}
          <div className={styles["info_text"]}>
            {desc}
          </div>
          <div className={styles["info_labels"]}>
            {projectTechs}
          </div>
        </div>
      )
    });

    return (
      <div className={styles["section"]}>
        {titleInfo('个人项目', 'code')}
        <div className={styles["info_wrapper"]}>
          {projects}
        </div>
      </div>
    )
  }

  renderSupplements() {
    const { others } = this.props.resume;
    const { supplements } = others;
    if (!supplements.length) { return }

    const personalSupplements = supplements.map((supplement, index) => {
      return (
        <li key={index}>
          {supplement}
        </li>
      )
    });

    return (
      <div className={styles["section"]}>
        {titleInfo('自我评价', 'quote-left')}
        <div className={styles["info_wrapper"]}>
          <ul className={styles["info_intro"]}>
            {personalSupplements}
          </ul>
        </div>
      </div>
    )
  }

  renderSocialLinks() {
    const { others } = this.props.resume;
    const { socialLinks } = others;
    if (!socialLinks.some(social => validator.url(social.url))) { return }

    const socials = socialLinks.map((social, index) => {
      if (validator.url(social.url)) {
        const { url, name, text } = social;
        return (
          <li key={index}>
            <div className={styles["link_wrapper"]}>
              {text || LINK_NAMES[name] || name}
              &nbsp;:&nbsp;&nbsp;&nbsp;
              <a
                target="_blank"
                className={styles["list_link"]}
                href={url[0] === 'h' ? url : `//${url}`}>{url}</a>
            </div>
          </li>
        )
      }
    });

    return (
      <div className={styles["section"]}>
        {titleInfo('其他链接', 'link')}
        <div className={styles["info_wrapper"]}>
          <ul className={styles["info_intro"]}>
            {socials}
          </ul>
        </div>
      </div>
    )
  }

  renderLabels() {
    const { educations, workExperiences } = this.props.resume;
    const labels = [];
    if (educations.length) {
      const lastEducation = educations.sort(sortByEndDate).reverse()[0];
      const eduEndTime = lastEducation.endTime;
      if (getSecondsByDate(eduEndTime) >= DATE_NOW_SECONDS) {
        labels.push(
          <div className={styles["info_label"]} key={0}>在校</div>
        )
      }
    }

    if (workExperiences.length) {
      const lastWorkExperience = workExperiences.sort(sortByEndDate).reverse()[0];
      const workEndTime = lastWorkExperience.endTime;
      if (getSecondsByDate(workEndTime) >= DATE_NOW_SECONDS) {
        labels.push(
          <div className={styles["info_label"]} key={1}>在职</div>
        )
      }
    }

    if (labels.length) {
      return (
        <div className={styles["info_labels_container"]}>
          {labels}
        </div>
      )
    }
  }

  render() {
    const { showGithub } = this.state;
    const { resume, shareInfo, login } = this.props;
    const { info, others } = resume;
    const { useGithub, github } = shareInfo;

    if (useGithub && showGithub) {
      return (
        <div className={styles["container"]}>
          <div
            className={cx(
              styles["github_wrapper"],
              showGithub && styles["github_wrapper_active"]
            )}>
            {baseInfo(null, 'arrow-left', {
              style: styles["base_info_header"],
              component: (
                <span
                  onClick={() => this.changeShowGithub(false)}>
                  返回
                </span>
              )
            })}
            <GithubComponent
              isShare={true}
              githubSection={github}
              containerStyle={styles["github_container"]}
              login={login}
            />
          </div>
        </div>
      )
    }

    return (
      <div className={styles["container"]}>
        <div className={cx(
            styles["wrapper"]
        )}>
          <div className={styles["left"]}>
            {this.renderEducations()}
            {this.renderWorkExperiences()}
            {this.renderPersonalProjects()}
            {this.renderSupplements()}
            {this.renderSocialLinks()}
          </div>
          <div className={styles["right"]}>
            {baseInfo(info.name, info.gender, { style: styles["user_title"] })}
            {this.renderLabels()}<br/>
            {baseInfo(info.phone, 'mobile', { style: styles["right_info"] })}
            {baseInfo(null, 'envelope-o', {
              component: (
                <a href={`mailto:${info.email}`} className={styles["right_link"]}>{info.email}</a>
              )
            })}
            {baseInfo(`${info.location}   ${info.intention}`, 'map-marker', { style: styles["right_info"] })}
            {others.dream ? (
              <div className={styles["user_dream"]}>
                {baseInfo(others.dream, 'quote-left', { style: styles["right_info"] })}
              </div>
            ) : ''}
            {useGithub ? (
              baseInfo(null, 'github', {
                component: (
                  <a
                    onClick={() => this.changeShowGithub(true)}
                    className={styles["right_link_info"]}>
                    查看我的 github 总结报告
                  </a>
                )
              })
            ) : ''}
          </div>
        </div>
      </div>
    )
  }
}

ResumeComponent.propTypes = {
  resume: PropTypes.object,
  shareInfo: PropTypes.object,
  login: PropTypes.string
};

ResumeComponent.defaultProps = {
  resume: {},
  shareInfo: {},
  login: ''
};

export default ResumeComponent;
