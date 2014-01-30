
//validation
function validate(loan_amount,residual_amount,rate,term,frequency){	
	$('.error').each(function(){
		$(this)
			.css('visibility','hidden')
			.next()
			.css('border-color','')
	})
	$('#result').text('');


	var err = [];

	//console.log(loan_amount)
	if(isNaN(loan_amount) || loan_amount<1 ){
		err.push('loan_amount');
	}


	//console.log(residual_amount)
	if(isNaN(residual_amount)){
		residual_amount = 0;
		$('#residual_amount').val('0');
	
	}else if(residual_amount>loan_amount){
		err.push('residual_amount');
	}


	//console.log(term)
	if(isNaN(term) || (term<2 || term>5)){
		err.push('term');
	}


	//console.log(rate)
	if(isNaN(rate) ){
		err.push('rate');
	}else{
		switch(rate){
			case 5 : case 5.5 : case 6 : case 6.5 : 
			case 7 : case 7.5 : case 8 : case 8.5 : 
			case 9 : case 9.5 : case 10 : case 10.5 : 
			case 11 : case 11.5 : case 12 : case 12.5 : 
			case 13 : case 13.5 : case 14 : case 14.5 : 
			case 15 : case 15.5 : case 16 :
				break;

			default:
				err.push('rate');
		}
	}

	if(isNaN(frequency) ){
		err.push('frequency');
	}else{
		switch(frequency){
			case 12 : case 32 : case 52 :
				break;

			default:
				err.push('frequency');
		}
	}

	if(err.length){
		return err;
	}else{
		return false;
	}
}


$(function(){

	//enable +ve numbers only
	$('.pvt_dec')
		.numeric({/*decimal : '.',*/ separator : ',' , negative : false})


	//when changing resiual amount ...
	$('#residual_amount').change(function(){
console.log('asdf')
		var residual_amount =  parseFloat($(this)
												.val()
												.split(',')
												.join(''));

		var loan_amount = parseFloat($('#loan_amount')
									.val()
									.split(',')
									.join(''));

console.log(residual_amount)
console.log(loan_amount)

		//change residual percentage
		$('#residual_percentage')
					.val( residual_amount / loan_amount * 100);
console.log(Math.round($('#residual_percentage').val()))
		if(Math.round($('#residual_percentage').val()!=NaN)){
console.log('asdf')
			$('#residual_percentage').val(parseFloat($('#residual_percentage').val()).toFixed(2))
		}


		//validate 
		if(residual_amount>loan_amount){
			$(this)
				.css('border-color','red')
				.prev()
				.css('visibility','visible');

			$('#residual_percentage')
				.css('border-color','red')
				.prev()
				.css('visibility','visible');
		}
	})


	//when changing residual percentage ...
	$('#residual_percentage').change(function(){

		var residual_percentage =  parseFloat($(this)
													.val()
													.split(',')
													.join(''));

		var loan_amount = parseFloat($('#loan_amount')
									.val()
									.split(',')
									.join(''));


		//change residual amount
		$('#residual_amount')
						.val(residual_percentage * loan_amount / 100);
console.log(Math.round($('#residual_amount').val()))
		if(Math.round($('#residual_amount').val()) != NaN){
			$('#residual_amount').val(parseFloat($('#residual_amount').val()).toFixed(2))
		}

		//validate 
		if(residual_percentage>100){
			$(this)
				.css('border-color','red')
				.prev()
				.css('visibility','visible');

console.log('bb')
			$('#residual_amount')
				.css('border-color','red')
				.prev()
				.css('visibility','visible');
		}
	})


	// //when changing loan amount ...
	// $('#loan_amount').change(function(){
	// 	//change residual percentage
	// 	$('#residual_percentage').val(
	// 									($(this).val() / $('#loan_amount').val() * 100)
	// 										.toFixed(2)
	// 								)
	// })

	$('#calculate').click(function(e){
		e.preventDefault();


		var loan_amount   = parseFloat($('#loan_amount').val().split(',').join('')),
			rate          = parseFloat($('#rate').val()) ,
			term          = parseFloat($('#term').val()),
			frequency     = parseFloat($('input[name=frequency]:checked').val());


		if($('#residual_amount').val().length>0){
			residual_amount=parseFloat($('#residual_amount').val().split(',').join(''))
		}






		var res = validate(loan_amount,residual_amount,rate,term,frequency);

		if(res && res.length>0){
			for(var i=0;i<res.length;i++){

				if(res[i]=='residual_amount' && $('#residual_amount').val().length==0){
					$('#residual_amount').val('0');
					residual_amount=0;
					continue;
				}

console.log(res[i])
				$('#'+res[i])
					.css('border-color','red')
					.prev()
					.css('visibility','visible');
			}

			return false;
		}



		// Formuna used :
		// http://www.tvmcalcs.com/calculators/apps/lease_payments  
		//
		//                 FV
		//         PV - -------
		//                   N
		//              (1+i)
		// ---------------------------
		//  ---                   ---
		// |            1            |
		// | 1 -    ----------       |
		// |             N           |
		// |         (1+i)           |
		// | -----------------       |
		// |                         |
		// |         i               |
		// |                         |
		//  ---                   ---
		//
		//
		// where 
		//   PV = loan amount
		//   FV = Residual
		//   N  = term length * repayment frequency
		//   i  = interest rate / 12

		var PV = loan_amount,
		  	FV = residual_amount,
		  	N  = term * frequency,
		  	i  = rate / 12 / 100;

		// console.log('PV: '+PV)
		// console.log('FV: '+FV)
		// console.log('N: '+N)
		// console.log('i: '+i)


		var num = PV - FV / ( Math.pow((1+i),N) ); 

		var den =  (1- (1/Math.pow((1+i),N) )   ) / i ;

		var payment = (num/den).toFixed(2);


		$('#result').text(payment);

	})

})