import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Aside from '../../components/Aside';
import { togglePageAside } from './actions';

const AsideContainer = ({ pathname, togglePageAside }) => {
  const options = [
    {
      list: [
        {
          text: '价格段销量分析',
          path: '#/smart-week-analysis/premium-rate-search',
        },
      ],
    },
  ];

  return <Aside pathname={pathname} onToggle={togglePageAside} options={options} />;
};

AsideContainer.propTypes = {
  pathname: PropTypes.string.isRequired,
  togglePageAside: PropTypes.func.isRequired,
};

function mapStateToProps({ routing }) {
  return { pathname: routing.locationBeforeTransitions.pathname };
}

export default connect(mapStateToProps, {
  togglePageAside,
})(AsideContainer);
