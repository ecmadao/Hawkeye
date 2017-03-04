import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';

import Textarea from 'COMPONENTS/Textarea';
import Button from 'COMPONENTS/Button';
import Input from 'COMPONENTS/Input';
import Labels from 'COMPONENTS/Labels';
import InputsGroup from 'COMPONENTS/InputsGroup';

import styles from '../../styles/resume.css';
import actions from '../../redux/actions';
import locales from 'LOCALES';

const resumeTexts = locales("resume").sections.projects;

class PersonalProjects extends React.Component {
  constructor(props) {
    super(props);
    this.addTech = this.addTech.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.deleteTech = this.deleteTech.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
  }

  deleteProject(index) {
    return () => {
      this.props.actions.deletePersonalProject(index);
    }
  }

  renderProjects() {
    const { personalProjects } = this.props;
    return personalProjects.map((personalProject, index) => {
      const { url, desc, techs, title } = personalProject;
      return (
        <div className={styles["resume_piece_container"]} key={index}>
          <div className={cx(styles["resume_wrapper"], styles["with_margin"])}>
            <div className={styles["resume_delete"]} onClick={this.deleteProject(index)}>
              <i className="fa fa-trash-o" aria-hidden="true"></i>
            </div>
            <InputsGroup
              value={title}
              style="flat"
              placeholder={resumeTexts.projectName}
              customStyle={styles["single_input"]}
              onChange={this.handleProjectChange(index)('title')}>
              <div className={styles["project_link_wrapper"]}>
                <i className="fa fa-link" aria-hidden="true"></i>
                &nbsp;&nbsp;
                <Input
                  value={url}
                  type="url"
                  check={false}
                  style="borderless"
                  className="underline"
                  placeholder={resumeTexts.homepage}
                  onChange={this.handleProjectChange(index)('url')}
                />
              </div>
            </InputsGroup>
          </div>
          <div className={styles["resume_wrapper"]}>
            <Textarea
              max="200"
              value={desc}
              placeholder={resumeTexts.projectDesc}
              type="textarea"
              onChange={this.handleProjectChange(index)('desc')}
            />
          </div>
          <div className={styles["resume_wrapper"]}>
            <Labels
              labels={techs}
              onAdd={this.addTech(index)}
              onDelete={this.deleteTech(index)}
              max={5}
              placeholder={`+ ${resumeTexts.technologies}`}
            />
          </div>
        </div>
      )
    });
  }

  addTech(index) {
    return (tech) => {
      this.props.actions.addProjectTech(tech, index);
    }
  }

  deleteTech(projectIndex) {
    return (techIndex) => {
      this.props.actions.deleteProjectTech(projectIndex, techIndex)
    }
  }

  handleProjectChange(index) {
    const { actions } = this.props;
    return (type) => (value) => {
      actions.handlePersonalProjectChange({[type]: value}, index);
    }
  }

  render() {
    const { actions } = this.props;
    return (
      <div className={styles["resume_section_container"]}>
        <div className={styles["section_title"]}>
          {resumeTexts.title}
        </div>
        <div>
          {this.renderProjects()}
        </div>
        <div className={styles["resume_button_container"]}>
          <Button
            style="flat"
            value={resumeTexts.mainButton}
            leftIcon={(
              <i className="fa fa-plus-circle" aria-hidden="true"></i>
            )}
            onClick={actions.addPersonalProject}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { personalProjects } = state.resume;
  return { personalProjects }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalProjects);
