window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}
$(document).ready(function () {
  // fixes issue on laggy scrolling
  // window.scrollTo(0, 0);
  $("html").css('scroll-behavior', 'auto');

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

  // Initial load
  const parent = $(".container-main");
  const headerDiv = $('header');
  const mediumScreen = $('.medium-screen');
  const mobileScreen = $('.mobile-screen');
  const sideNavCon = $('.sidenav-container');
  const sideNav = $('#mySidenav');
  const barMenu = $('i.fa-bars');
  const dataCon = $('.data-container');
  let navHeight = headerDiv ? headerDiv.outerHeight() : 0;
  let width = $(window).width();
  const result = [];

  const setNav = (w) => {
    if (w < 850) {
      mediumScreen.addClass('display-none');
      mobileScreen.removeClass('display-none');
    } else {
      mediumScreen.removeClass('display-none');
      mobileScreen.addClass('display-none');
    }
  }

  setNav(width);

  $(window).resize(function () {
    navHeight = headerDiv.outerHeight()
    width = $(this).width()

    console.log('[ Width ]', width, navHeight)
    setNav(width);
  });

  const openNav = () => {
    console.log('removing')
    barMenu.addClass('display-none');
    sideNavCon.removeClass('display-none')
    // sideNav.removeClass('display-none')
    document.getElementById("mySidenav").style.width = "250px";
  }

  const closeNav = () => {
    barMenu.removeClass('display-none');
    sideNavCon.addClass('display-none')
    // sideNav.addClass('display-none')
    document.getElementById("mySidenav").style.width = "0";
  }

  $('i.fa-bars').on('click', function () {
    openNav()
  });
  $('.close-nav-btn').on('click', function () {
    closeNav()
  })


  /* Sticky header */
  // var stickyOffset = $('header').offset().top;

  // $(window).scroll(function () {
  //   var sticky = $('header'),
  //     scroll = $(window).scrollTop();
  //   console.log(stickyOffset, scroll)

  //   if (scroll) sticky.addClass('sticky');
  //   else sticky.removeClass('sticky');
  // });
  /* End of Sticky header */


  $('#top').on('click', function () {
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  });

  questions.forEach((p, i) => {
    i = i + 1;
    const questionBody = parent.find('.question-container:first').clone(true, true);
    const temp = $(questionBody);
    const radios = temp.find('input[type=radio]');

    $(temp).find('input[type=radio]').each(function () {
      // Update the 'rules[0]' part of the name attribute to contain the latest count 
      $(this).attr('name', $(this).attr('name').replace('color\[0\]', `color\[${i}\]`));
      $(this).attr('id', $(this).attr('id').replace('row-0-color', `row-${i}-color`));

      $(this).siblings('label').attr('for', $(this).siblings('label').attr('for').replace('row-0-color', `row-${i}-color`));
    });

    temp.find('.title p').html(p);
    console.log(temp.attr('id'))
    temp.attr('id', temp.attr('id').replace('que-1', `que-${i + 1}`))

    parent.append(questionBody)
  })


  const bg = "../images/gradient.png";

  // just removed this for now
  // $('body').css('background-image', 'url(' + bg + ')');
  //console.log("RarityBG" + trinketJSON.RarityBG);


  console.log(parent.find('.question-container').length)


  $('.choice').on('change', function () {
    const par = $(this).closest('.question-container');
    const nextQuestion = $(par).next();

    if (nextQuestion.length !== 0) {
      $('html, body').animate({
        scrollTop: $(`#${nextQuestion.attr('id')}`).offset().top + (-navHeight)
      }, 1000);

    }

    if (par.attr('id') === 'que-15') {
      $("html, body").animate({ scrollTop: dataCon.offset().top }, 1000);
    }

    Array.from({ length: 15 }, (v, i) => i).forEach(function (ti, i) {
      result[i] = +$(`input[name='color[${i}]']:checked`).attr('value')
    });

    const isComplete = result.every(n => n === n);
    console.log('Is Complete ', result, isComplete);

    if (isComplete) {
      $("html, body").animate({ scrollTop: dataCon.offset().top }, 1000);
      // dataCon.animate({ scrollTop: 0 + (-navHeight) }, 1000);
    }
  });


  $('form').on('submit', async function (event) {
    event.preventDefault();

    const apiCall = async () => {
      const name = $('#name').val().trim();
      const email = $('#email').val().trim();
      const errMod = $('#errorModal');
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
        // alert(`Please answer question number(s):${tempErrMessages} `)
        errMsg = tempErrMessages;

        errMod.find('.error-message').text(errMsg)
        errMod.modal('toggle');

        var nq = $('.question-container').eq(errMessages[0] - 1);
        $('html, body').animate({
          scrollTop: nq.offset().top + (-navHeight)
        }, 1000);
      }

      // // Call API
      // $.ajax({
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
            const successMsg = `Score : ${score} \nResult : ${result}`;

            const successMod = $('#successModal');
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

});