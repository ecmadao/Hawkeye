import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import config from './config';
import Operations from 'COMPONENTS/Operations';
import Tipso from 'COMPONENTS/Tipso';
import cardStyles from './styles/info_card.css';
import locales from 'LOCALES';

const operationTexts = locales('github').operations;
const EmptyDOM = (props) => {
  return (
    <div></div>
  )
};

class GithubSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTipso: false,
      showOperations: false
    };
    this.onMenuClick = this.onMenuClick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onOperationFocusChange = this.onOperationFocusChange.bind(this);
  }

  onOperationFocusChange(value) {
    this.setState({
      showOperations: value
    });
  }

  onMenuClick(value) {
    const { callback } = this.props;
    callback && callback(value);
    this.onOperationFocusChange(false);
  }

  get operationItems() {
    const { section, sectionStatus } = this.props;
    return [
      {
        text: sectionStatus ? operationTexts.share.hide : operationTexts.share.show,
        onClick: () => this.onMenuClick({
          [section]: !sectionStatus
        })
      }
    ]
  }

  onMouseEnter() {
    this.setState({ showTipso: true })
  }

  onMouseLeave() {
    this.setState({ showTipso: false })
  }

  render() {
    const {
      hide,
      disabled,
      title,
      section,
      className,
      isShare,
      intro
    } = this.props;
    const { showTipso, showOperations } = this.state;
    if (hide) { return <EmptyDOM />; }

    const Section = config[section] || EmptyDOM;
    const disabledClass = disabled ? cardStyles["info_card_disabled"] : '';

    return (
      <div className={cx(cardStyles["info_card_container"], className)}>
        <p>
          <i aria-hidden="true" className={`fa fa-${title.icon}`}></i>
          &nbsp;&nbsp;{title.text}&nbsp;&nbsp;
          {intro ? (
            <span
              onMouseOver={this.onMouseEnter}
              onMouseEnter={this.onMouseEnter}
              onMouseOut={this.onMouseLeave}
              onMouseLeave={this.onMouseLeave}
              className={cardStyles["card_intro"]}>
              <i className={`fa fa-${intro.icon}`} aria-hidden="true"></i>
              {showTipso ? (
                <Tipso
                  show={true}
                  className={cardStyles["card_tipso"]}>
                  <span>{intro.text}</span>
                </Tipso>
              ) : ''}
            </span>
          ) : ''}
        </p>
        <Section {...this.props} className={disabledClass} />
        {!isShare ? (
          <Operations
            className={cardStyles["card_operation"]}
            items={this.operationItems}
            showOperations={showOperations}
            onFocusChange={this.onOperationFocusChange}
          />
        ) : ''}
      </div>
    )
  }
}

GithubSection.PropTypes = {
  section: PropTypes.string,
  disabled: PropTypes.bool,
  hide: PropTypes.bool,
  isShare: PropTypes.bool,
  show: PropTypes.bool,
  title: PropTypes.object,
  className: PropTypes.string,
  callback: PropTypes.func,
  intro: PropTypes.object
};

GithubSection.defaultProps = {
  section: Object.keys(config)[0],
  disabled: false,
  hide: false,
  isShare: false,
  show: true,
  title: {
    text: '',
    icon: ''
  },
  className: '',
  callback: () => {},
  intro: null
};

export default GithubSection;
