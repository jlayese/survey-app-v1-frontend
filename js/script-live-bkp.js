$(document).ready(function () {

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
  const parent = $(".container");

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

    temp.find('.title > p').html(p);

    parent.append(questionBody)
  })

  console.log(parent.find('.question-container').length)


  $('.choice').on('change', function () {
    var nextQuestion = $(this).closest('.question-container').next();

    if (nextQuestion.length !== 0) {
      $('html, body').animate({
        scrollTop: nextQuestion.offset().top
      }, 1000);
    }

    Array.from({ length: 15 }, (v, i) => i).forEach(function (ti, i) {
      result[i] = +$(`input[name='color[${i}]']:checked`).attr('value')
    });

    const isComplete = result.every(n => n === n);
    console.log(result, isComplete);

    if (isComplete) {
      $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    }
  });


  $('form').on('submit', function (event) {
    event.preventDefault();
    // $('#hiddenInput').val(someVariable); //perform some operations
    // this.submit(); //now submit the form

    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    console.log(name, email, result)

    // validation
    if (!result.length) return alert('Please fill all the survey questions');


    if (!name.length) return alert('Please enter your name');
    if (!email.length) return alert('Please enter your email');


    if (email.length) {
      const checkMail = isEmail(email);
      if (!checkMail) return alert('Please use a valid email');
    }

    let errMessages = result.reduce((p, c, i) => {
      p = [...p];

      if (!c) p.push(i + 1)

      return p;
    }, [])

    errMessages = errMessages.join(', ');
    console.log(errMessages)


    if (errMessages.length) alert(`Please answer question number(s):${errMessages} `)

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
          alert(`Score : ${score} \nResult : ${result}`)
        }

      } catch (error) {
        console.log(error)
      }
    }

    asyncPostCall()

  });


  function isEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  window.scrollTo(0, 0);

});