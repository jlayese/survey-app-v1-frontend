// feather.replace();
jQuery(document).ready(function () {
  // fixes issue on laggy scrolling
  jQuery("html").css('scroll-behavior', 'auto');

  const questions = [
    '2. I always set goals for me and then I try my best to achieve them.',
    '3. Much of what happens to me is probably a matter of chance.',
    '4. I am good at spotting a business opportunity.',
    '5. I am a self-motivated person.',
    '6. Getting promoted is really a matter of being a little luckier than the next guy.',
    '7. I am not the master of my entrepreneurial destiny.',
    '8. I put my ideas into action whenever I can.',
    '9. I am good at connecting my ideas, people, and opportunities.',
    '10. I believe I can succeed at almost any endeavor to which I set my mind.',
    '11. When facing difficult tasks, I am certain that I will accomplish them.',
    '12. My negotiating skills are poor.',
    '13. I am not good at making decisions.',
    '14. What I choose to do makes an enormous difference in my life.',
    '15. I am good at getting people to agree with me.',
  ]

  const result = [];

  // Initial load
  const parent = jQuery(".container-main");

  questions.forEach((p, i) => {
    i = i + 1;
    const questionBody = parent.find('.question-container:first').clone(true, true);
    const temp = jQuery(questionBody);
    const radios = temp.find('input[type=radio]');

    jQuery(temp).find('input[type=radio]').each(function () {
      // Update the 'rules[0]' part of the name attribute to contain the latest count 
      jQuery(this).attr('name', jQuery(this).attr('name').replace('color\[0\]', `color\[jQuery{i}\]`));
      jQuery(this).attr('id', jQuery(this).attr('id').replace('row-0-color', `row-jQuery{i}-color`));

      jQuery(this).siblings('label').attr('for', jQuery(this).siblings('label').attr('for').replace('row-0-color', `row-jQuery{i}-color`));
    });

    temp.find('.title p').html(p);
    console.log(temp.attr('id'))
    temp.attr('id', temp.attr('id').replace('que-1', `que-jQuery{i + 1}`))

    parent.append(questionBody)
  })

  console.log(parent.find('.question-container').length)


  jQuery('.choice').on('change', function () {
    const par = jQuery(this).closest('.question-container');
    const nextQuestion = jQuery(par).next();

    console.log(par.attr('id'), nextQuestion.attr('id'))

    if (nextQuestion.length !== 0) {
      jQuery('html, body').animate({
        scrollTop: jQuery(`#jQuery{nextQuestion.attr('id')}`).offset().top
      }, 1000);

    }

    if (par.attr('id') === 'que-15') {
      jQuery("html, body").animate({ scrollTop: jQuery(document).height() }, 1000);
    }

    Array.from({ length: 15 }, (v, i) => i).forEach(function (ti, i) {
      result[i] = +jQuery(`input[name='color[jQuery{i}]']:checked`).attr('value')
    });

    const isComplete = result.every(n => n === n);
    console.log('Is Complete ', result, isComplete);

    if (isComplete) {
      jQuery("html, body").animate({ scrollTop: jQuery(document).height() }, 1000);
    }
  });


  jQuery('form').on('submit', async function (event) {
    event.preventDefault();

    const apiCall = async () => {
      const name = jQuery('#name').val().trim();
      const email = jQuery('#email').val().trim();
      const errMod = jQuery('#errorModal');
      let errMsg = '';
      console.log(name, email, result)

      // validation
      if (!result.length)
        errMsg = 'Please fill all the survey questions';

      if (!name.length)
        errMsg = 'Please enter your name';

      if (!email.length)
        errMsg = 'Please enter your email';

      if (email.length) {
        const checkMail = isEmail(email);
        if (!checkMail)
          errMsg = 'Please use a valid email';
      }

      if (errMsg.length) {
        errMod.find('.error-message').text(errMsg);
        errMod.modal('show');
        return;
      }


      const errMessages = result.reduce((p, c, i) => {
        p = [...p];

        if (!c) p.push(i + 1)

        return p;
      }, [])

      const tempErrMessages = errMessages.join(', ');

      if (errMessages.length) {
        // alert(`Please answer question number(s):jQuery{tempErrMessages} `)
        errMsg = tempErrMessages;

        errMod.find('.error-message').text(errMsg)
        errMod.modal('toggle');

        var nq = jQuery('.question-container').eq(errMessages[0] - 1);
        jQuery('html, body').animate({
          scrollTop: nq.offset().top
        }, 1000);
      }

      // // Call API
      // jQuery.ajax({
      //   url: "https://node-wp-v1.herokuapp.com/api/v1/questions",
      //   type: "post",
      //   data: JSON.stringify({
      //     data: [...result],
      //     name,
      //     email,
      //   }),
      //   success: function (response) {
      //     console.log(response)
      //     // You will get response from your PHP page (what you echo or print)
      //   },
      //   error: function (jqXHR, textStatus, errorThrown) {
      //     console.log(textStatus, errorThrown);
      //   }
      // });



      const asyncPostCall = async () => {
        try {
          const response = await fetch('https://node-wp-v1.herokuapp.com/api/v1/questions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              // your expected POST request payload goes here
              data: result,
              name,
              email
            })
          });
          const data = await response.json();

          console.log(data);
          if (data.status === 'success') {
            const { result, score } = data.data
            const successMsg = `Score : jQuery{score} \nResult : jQuery{result}`;

            const successMod = jQuery('#successModal');
            successMod.find('.score').text(score);
            successMod.find('.result').text(result);
            successMod.modal('toggle');

            grecaptcha.ready(function () {
              grecaptcha.execute('6Lfn55MjAAAAAPyeQNtgAs27c479whQ3pHuu2kVD', { action: 'submit' }).then(function (token) {
                // Add your logic to submit to your backend server here.
                console.log('TOKEN  > ', token)
              });
            });

          }

        } catch (error) {
          console.log(error)
        }
      }

      asyncPostCall()

    }

    await apiCall()

  });


  function isEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }



  window.scrollTo(0, 0);

});