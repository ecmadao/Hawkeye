import React from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';
import cx from 'classnames';
import objectAssign from 'object-assign';

import Api from 'API/index';
import dateHelper from 'UTILS/date';
import { getValidateViewSources } from 'UTILS/analysis';
import { LINECHART_CONFIG } from 'UTILS/const_value';
import { GREEN_COLORS } from 'UTILS/colors';
import ChartInfo from 'COMPONENTS/ChartInfo';
import Loading from 'COMPONENTS/Loading';
import Input from 'COMPONENTS/Input';
import IconButton from 'COMPONENTS/IconButton';
import styles from '../styles/analysis.css';
import sharedStyles from '../../shared/styles/mobile.css';
import locales from 'LOCALES';
import { sortByX } from 'UTILS/helper';

const sortByCount = sortByX('count');
const analysisTexts = locales('dashboard').profile;

class MobileAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userInfo: {
        url: '',
        openShare: false
      },
      viewDevices: [],
      viewSources: [],
      pageViews: []
    };
    this.pageViewsChart = null;
    this.viewDevicesChart = null;
    this.viewSourcesChart = null;

    this.copyUrl = this.copyUrl.bind(this);
  }

  componentDidMount() {
    Api.github.getShareRecords().then((result) => {
      this.initialState(result);
    });
  }

  componentDidUpdate() {
    const { loading } = this.state;
    if (loading) { return }
    this.renderCharts();
  }

  copyUrl() {
    document.querySelector("#shareGithubUrl").select();
  }

  renderCharts() {
    // !this.pageViewsChart && this.renderViewsChart();
    !this.viewDevicesChart && this.renderDevicesChart();
    !this.viewSourcesChart && this.renderSourcesChart();
  }

  renderViewsChart() {
    const { pageViews } = this.state;
    const viewsChart = ReactDOM.findDOMNode(this.pageViews);
    const validatePageViews = [];
    pageViews.forEach((pageView) => {
      const { count, date } = pageView;
      const filterPageViews = validatePageViews.filter(validatePageView => validatePageView.date === date);
      if(filterPageViews.length) {
        filterPageViews[0].count += count;
      } else {
        validatePageViews.push({
          count,
          date
        });
      }
    });
    const dateLabels = validatePageViews.map((pageView) => {
      const { date } = pageView;
      return `${dateHelper.validator.fullDate(date)} ${dateHelper.validator.hour(date)}:00`;
    });
    const viewDates = validatePageViews.map(pageView => pageView.count);
    const datasetsConfig = {
      data: viewDates,
      label: analysisTexts.common.hourlyViewChartTitle,
      pointBorderWidth: 0,
      pointRadius: 0
    };

    this.pageViewsChart = new Chart(viewsChart, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [objectAssign({}, LINECHART_CONFIG, datasetsConfig)]
      },
      options: {
        title: {
          display: true,
          text: analysisTexts.common.hourlyViewChartTitle
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            display: false,
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
            }
          }],
        },
        tooltips: {
          callbacks: {
            title: (item, data) => {
              return item[0].xLabel
            },
            label: (item, data) => {
              return `${item.yLabel} PV`
            }
          }
        }
      }
    });
  }

  getDatas(type) {
    const {
      viewDevices,
      viewSources
    } = this.state;

    const datas = {
      viewDevices: viewDevices.sort(sortByCount).slice(0, 6),
      viewSources: viewSources.sort(sortByCount).slice(0, 6),
    };

    return datas[type];
  }


  renderDevicesChart() {
    const viewDevices = this.getDatas('viewDevices');
    const viewDevicesChart = ReactDOM.findDOMNode(this.viewDevices);
    const labels = viewDevices.map(viewDevice => viewDevice.platform);
    const datas = viewDevices.map(viewDevice => viewDevice.count);
    this.viewDevicesChart = new Chart(viewDevicesChart, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          data: datas,
          label: '',
          fill: true,
          backgroundColor: GREEN_COLORS[4],
          borderWidth: 2,
          borderColor: GREEN_COLORS[0],
          pointBackgroundColor: GREEN_COLORS[0],
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: GREEN_COLORS[0]
        }]
      },
      options: {
        title: {
          display: true,
          text: analysisTexts.common.platformChartTitle
        },
        legend: {
          display: false,
        }
      }
    });
  }

  renderSourcesChart() {
    const viewSources = this.getDatas('viewSources');
    const viewSourcesChart = ReactDOM.findDOMNode(this.viewSources);
    const labels = viewSources.map(viewSource => viewSource.browser);
    const datas = viewSources.map(viewSource => viewSource.count);

    this.viewSourcesChart = new Chart(viewSourcesChart, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          data: datas,
          label: '',
          fill: true,
          backgroundColor: GREEN_COLORS[4],
          borderWidth: 2,
          borderColor: GREEN_COLORS[0],
          pointBackgroundColor: GREEN_COLORS[0],
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: GREEN_COLORS[0]
        }]
      },
      options: {
        title: {
          display: true,
          text: analysisTexts.common.browserChartTitle
        },
        legend: {
          display: false,
        }
      }
    });
  }

  initialState(datas) {
    const { userInfo } = this.state;
    const {
      url,
      openShare,
      viewDevices,
      viewSources,
      pageViews
    } = datas;
    this.setState({
      loading: false,
      userInfo: objectAssign({}, userInfo, { url, openShare }),
      viewDevices: [...viewDevices],
      viewSources: getValidateViewSources(viewSources),
      pageViews: pageViews.filter(pageView => !isNaN(pageView.count))
    });
  }

  renderShareController() {
    const { actions, userInfo } = this.state;
    const { openShare, url } = userInfo;
    return (
      <div className={cx(sharedStyles["mobile_card"], styles["share_controller"])}>
        <div
          className={styles["share_container"]}>
          <Input
            id="shareGithubUrl"
            style="flat"
            value={`${window.location.origin}/${url}`}
            customStyle={styles["share_link_input"]}
          />
          <IconButton
            icon="clipboard"
            id="copyLinkButton"
            onClick={this.copyUrl.bind(this)}
          />
        </div>
      </div>
    )
  }

  renderChartInfo() {
    const { pageViews, viewDevices, viewSources } = this.state;
    const pageViewCounts = pageViews.map(item => item.count);

    const viewCount = pageViewCounts.reduce((prev, current, index) => {
      return current + prev
    }, 0);
    const maxViewPerHour = Math.max(...pageViewCounts);

    return (
      <div
        className={sharedStyles["mobile_card"]}>
        <div className={sharedStyles["info_wrapper"]}>
          <ChartInfo
            mainText={viewCount}
            subText={analysisTexts.common.pv}
            mainTextStyle={sharedStyles["main_text"]}
          />
          <ChartInfo
            mainText={maxViewPerHour}
            subText={analysisTexts.common.maxPvPerHour}
            mainTextStyle={sharedStyles["main_text"]}
          />
        </div>
      </div>
    )
  }

  renderBrowserInfo() {
    const { viewSources } = this.state;

    const maxBrowserCount = Math.max(...viewSources.map(viewSource => viewSource.count));
    const browsers = viewSources
      .filter(viewSource => viewSource.count === maxBrowserCount)
      .map(viewSource => viewSource.browser);
    return (
      <div className={sharedStyles["info_with_chart"]}>
        <ChartInfo
          mainText={browsers.join(',')}
          subText={analysisTexts.common.browser}
          mainTextStyle={sharedStyles["main_text"]}
        />
      </div>
    )
  }

  renderPlatformInfo() {
    const { viewDevices } = this.state;

    const maxPlatformCount = Math.max(...viewDevices.map(viewDevice => viewDevice.count));
    const platforms = viewDevices
      .filter(viewDevice => viewDevice.count === maxPlatformCount)
      .map(viewDevice => viewDevice.platform);

    return (
      <div className={sharedStyles["info_with_chart"]}>
        <ChartInfo
          mainText={platforms.slice(0, 2).join(',')}
          subText={analysisTexts.common.platform}
          mainTextStyle={sharedStyles["main_text"]}
        />
      </div>
    )
  }

  render() {
    const { loading, userInfo } = this.state;

    return (
      <div className={styles["analysis"]}>
        {loading ? '' : this.renderShareController()}
        {loading ? '' : this.renderChartInfo()}

        <div className={sharedStyles["mobile_card"]}>
          {loading ? '' : this.renderPlatformInfo()}
          <div
            className={styles["share_info_chart"]}>
            <canvas
              className={sharedStyles["min_canvas"]}
              ref={ref => this.viewDevices = ref}></canvas>
          </div>
        </div>

        <div className={sharedStyles["mobile_card"]}>
          {loading ? '' : this.renderBrowserInfo()}
          <div
            className={styles["share_info_chart"]}>
            <canvas
              className={sharedStyles["min_canvas"]}
              ref={ref => this.viewSources = ref}></canvas>
          </div>
        </div>

        {/* <div className={sharedStyles["share_section"]}>
          <div
            className={sharedStyles["share_info_chart"]}>
            <canvas
              className={sharedStyles["max_canvas"]}
              ref={ref => this.pageViews = ref}></canvas>
          </div>
        </div> */}
      </div>
    )
  }
}

export default MobileAnalysis;
