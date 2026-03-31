import { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPaymentClientToken } from '../../store/cartSlice';
import UserUtil from '../../util/UserUtil';

function BraintreePayment() {
  const userToken = useSelector((state) => state.user.token);
  const config = useSelector((state) => state.config);
  const paymentClientToken = useSelector((state) => state.cart.paymentClientToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!UserUtil.isValidUserToken(userToken)) {
      navigate('/login');
    }
  }, [userToken, navigate]);

  const displayPaymentForm = useCallback(
    async (clientToken) => {
      try {
        const dropin = await import('braintree-web-drop-in');
        const container = containerRef.current;
        const button = buttonRef.current;
        const checkoutUrl = config.paymentCheckoutUrl;

        dropin.create(
          {
            authorization: clientToken,
            container: `#${container.id}`,
          },
          (createErr, instance) => {
            button.addEventListener('click', () => {
              instance.requestPaymentMethod((err, payload) => {
                console.log('payload', payload);
                console.log('nonce', payload.nonce);
                const form = new FormData();
                form.append('nonce', payload.nonce);
                form.append('amount', '23.85');
                fetch(checkoutUrl, {
                  method: 'post',
                  body: form,
                })
                  .then((response) => {
                    if (!response.ok) throw Error(response.statusText);
                    return response.json();
                  })
                  .then((json) => {
                    console.log('payment checkout response', json);
                  })
                  .catch(() => {
                    console.log('payment checkout error');
                  });
              });
            });
          }
        );
      } catch (err) {
        console.error('Failed to load braintree dropin:', err);
      }
    },
    [config.paymentCheckoutUrl]
  );

  useEffect(() => {
    if (!UserUtil.isValidUserToken(userToken)) return;

    if (config.paymentClientTokenUrl) {
      dispatch(fetchPaymentClientToken(config.paymentClientTokenUrl));
    }
  }, [dispatch, config.paymentClientTokenUrl, userToken]);

  useEffect(() => {
    if (paymentClientToken.data && paymentClientToken.status === 'succeeded') {
      displayPaymentForm(paymentClientToken.data);
    }
    if (paymentClientToken.data && paymentClientToken.status === 'failed') {
      // Mock fallback already handled by slice
      displayPaymentForm(paymentClientToken.data);
    }
  }, [paymentClientToken.data, paymentClientToken.status, displayPaymentForm]);

  if (!UserUtil.isValidUserToken(userToken)) {
    return <div></div>;
  }

  return (
    <div>
      <h1>Payment Page</h1>
      <div id="dropin-container" ref={containerRef}></div>
      <button ref={buttonRef}>Purchase</button>
    </div>
  );
}

export default BraintreePayment;
