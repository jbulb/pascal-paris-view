import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserUtil from '../../util/UserUtil';

function IntuitPayment() {
  const userToken = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: 10.55,
    expYear: '2020',
    expMonth: '02',
    region: 'CA',
    postalCode: '94086',
    streetAddress: '1130 Kifer Rd',
    country: 'US',
    city: 'Sunnyvale',
    name: 'emulate=0',
    cvc: '123',
    number: '4111111111111111',
    currency: 'USD',
  });

  useEffect(() => {
    if (!UserUtil.isValidUserToken(userToken)) {
      navigate('/login');
    }
  }, [userToken, navigate]);

  const handleChange = (field) => (evt) => {
    setFormData((prev) => ({ ...prev, [field]: evt.target.value }));
  };

  const sendChargeRequest = (ippToken) => {
    console.log('sending charge request...');

    const url = '/tolvatech/cart/ipp/charge';

    const payload = {
      amount: formData.amount,
      currency: formData.currency,
      ippToken,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('ipp payment auth response', JSON.stringify(data));
      })
      .catch((error) => {
        console.log(`Error processing charge: ${error}`);
      });
  };

  const handleFormSubmit = (evt) => {
    evt.preventDefault();

    const tokenUrl = 'https://sandbox.api.intuit.com/quickbooks/v4/payments/tokens';

    const payload = {
      card: {
        expYear: formData.expYear,
        expMonth: formData.expMonth,
        address: {
          region: formData.region,
          postalCode: formData.postalCode,
          streetAddress: formData.streetAddress,
          country: formData.country,
          city: formData.city,
        },
        name: formData.name,
        cvc: formData.cvc,
        number: formData.number,
      },
    };

    console.log('payload', JSON.stringify(payload, '\t', null));

    fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('ipp token response', JSON.stringify(data));
        sendChargeRequest(data.value);
      })
      .catch((error) => {
        console.log(`Error fetching token: ${error}`);
      });

    return false;
  };

  if (!UserUtil.isValidUserToken(userToken)) {
    return <div></div>;
  }

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label>Credit Card Number</label>
        <input type="text" value={formData.number} onChange={handleChange('number')} />
        <br />
        <label>Expiration Month</label>
        <input type="text" value={formData.expMonth} onChange={handleChange('expMonth')} />
        <br />
        <label>Expiration Year</label>
        <input type="text" value={formData.expYear} onChange={handleChange('expYear')} />
        <br />
        <label>Card Verification Code</label>
        <input type="text" value={formData.cvc} onChange={handleChange('cvc')} />
        <br />
        <label>Name as Shown on Card</label>
        <input type="text" value={formData.name} onChange={handleChange('name')} />
        <br />
        <label>Street Address</label>
        <input
          type="text"
          value={formData.streetAddress}
          onChange={handleChange('streetAddress')}
        />
        <br />
        <label>City</label>
        <input type="text" value={formData.city} onChange={handleChange('city')} />
        <br />
        <label>State (Region)</label>
        <input type="text" value={formData.region} onChange={handleChange('region')} />
        <br />
        <label>Country</label>
        <input type="text" value={formData.country} onChange={handleChange('country')} />
        <br />
        <label>Zip Code (Postal Code)</label>
        <input
          type="text"
          value={formData.postalCode}
          onChange={handleChange('postalCode')}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default IntuitPayment;
