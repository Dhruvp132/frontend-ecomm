import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function PaymentSuccess() {
    const history = useHistory();
    
    // useEffect(() => {
    //     setTimeout((handler) => {
    //         history.push('/');
    //     }, 5000)
    // },[])

    // If the state is not present, redirect to home
    if (!history.location.state || !history.location.state.paymentSuccess) {
        history.replace('/');
        return null;
    }


    //When actually payment is done then only show that else just redirect to home
    //TODO: Make the payment success UI and frontend better 
    return (
        <>        
        <div>
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase.</p>

            <h3>You will be redirected in 5 seconds </h3>
        </div>
        <button onClick={() => history.push("/")}>Go HOME</button>
        </>
    );
}

export default PaymentSuccess;