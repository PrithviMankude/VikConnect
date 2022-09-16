import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

const Alert = () => {
  const alerts = useSelector((state) => state.alert);

  <Fragment>
    <div className='alert-wrapper'>
      const alertMessage = alerts !== null && alerts.length > 0 &&
      alerts.map((alert) => (
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
      </div>
      ));
    </div>
    return alertMessage;
  </Fragment>;
};

Alert.propTypes = {};

export default Alert;
