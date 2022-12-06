import { useState, useRef } from 'react';

/**
 * Contact Form component.
 */
const ContactForm = () => {
  // Name of the sender.
  const [name, setName] = useState('');
  // Email address of the sender.
  const [email, setEmail] = useState('');
  // Subject of the email.
  const [subject, setSubject] = useState('');
  // Message of the email.
  const [message, setMessage] = useState('');
  // Sort of a spam "inspector", which checks if honeypot has trapped a bot.
  const [inspector, setInspector] = useState('');
  // Status information about the contact form.
  const [status, setStatus] = useState({
    hasError: false,
    isSubmitted: false,
    message: [],
  });

  // Reference to the DOM element with the sender name.
  const nameInputRef = useRef(null);
  // Reference to the DOM element with the sender email address.
  const emailInputRef = useRef(null);
  // Reference to the DOM element with the email subject.
  const subjectInputRef = useRef(null);
  // Reference to the DOM element with the email message.
  const messageInputRef = useRef(null);

  const displayNotices = () => {
    // Make sure there are message(s) for notices.
    if (!status.message.length) {
      return;
    }

    // Notice
    const notice = (type, message) => {
      let cssClasses = 'border border-solid p-4 rounded mb-4 text-sm';

      switch (type) {
        case 'success':
          cssClasses += ' text-green-700 border-green-400 bg-green-50';
          break;
        default:
          cssClasses += ' text-red-700 border-red-400 bg-red-50';
      }

      return (
        <div className={cssClasses}>
          <p className='flex gap-3 items-center'>
            <span className='flex-1'>
              <strong>{message.title}: </strong>
              {message.description}.
            </span>
          </p>
        </div>
      );
    };

    // Output notice with a success information.
    if (status.isSubmitted && !status.hasError) {
      return notice('success', status.message[0]);
    }

    // Output notice with an error information.
    if (status.hasError) {
      let jsxErrors = [];

      status.message.map((message, index) => {
        jsxErrors.push(<li key={index}>{notice('error', message)}</li>);
      });

      return <ul>{jsxErrors}</ul>;
    }
  };

  // Display error in input field.
  const displayInputError = (element) => {
    // Add CSS classes to the element.
    element.classList.add('placeholder:text-red-700', 'border-red-400');
    // Remove CSS classes in the element.
    element.classList.remove('border-slate-300');
  };

  // Clear error in input field.
  const clearInputError = (element) => {
    // Add CSS classes to the element.
    element.classList.add('border-slate-300');
    // Remove CSS classes in the element.
    element.classList.remove('border-red-400');
  };

  // Detect input focus.
  const handleOnBlur = (element) => {
    if ('' !== element.value) {
      clearInputError(element);
    } else {
      displayInputError(element);
    }
  };

  // Detect message submission.
  const handleSubmit = (e) => {
    e.preventDefault();

    // Email data.
    let data = {
      name,
      email,
      subject,
      message,
      inspector,
    };

    // Pattern for email address.
    const emailRegex = /\S+@\S+\.\S+/;

    // Check if the user entered a name; otherwise show an error.
    if (!name) {
      displayInputError(nameInputRef.current);
    }

    // Check if the user entered an email; otherwise show an error.
    if (!email) {
      displayInputError(emailInputRef.current);
    } else {
      // Make sure the user entered a valid email; otherwise indicate an error.
      if (!emailRegex.test(email)) {
        displayInputError(emailInputRef.current);
        setStatus({
          hasError: true,
          isSubmitted: false,
          message: [
            {
              title: 'Email format is not valid',
              description:
                'please enter an email with a valid format and then try to send your message again',
            },
          ],
        });
      }
    }

    // Check if the user entered a subject; otherwise show an error.
    if (!subject) {
      displayInputError(subjectInputRef.current);
    }

    // Check if the user entered a message; otherwise show an error.
    if (!message) {
      displayInputError(messageInputRef.current);
    }

    // Avoid a send action if fields are not filled or email address is not valid.
    if (!name || !email || !emailRegex.test(email) || !subject || !message) {
      return;
    }

    // Make a request to send the email using API.
    fetch('/api/formtest', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => {
      // Display an error message.
      if (200 !== response.status) {
        setStatus({
          hasError: true,
          isSubmitted: false,
          message: [
            {
              title: 'Message was not sent',
              description: 'something went wrong, please try again later',
            },
          ],
        });

        return;
      }

      // Display a successful message.
      setStatus({
        hasError: false,
        isSubmitted: true,
        message: [
          {
            title: 'Message sent',
            description: 'thank you for your time writing this message',
          },
        ],
      });
    });
  };

  return (
    <form className='flex flex-col gap-4'>
      {displayNotices()}

      {!status.isSubmitted && (
        <>
          <p className='flex sm:flex-row flex-col sm:gap-4 gap-2 focus-within:font-bold'>
            <label htmlFor='name' className='w-64'>
              Name:
            </label>
            <input
              id='name'
              className='
                             rounded w-full shadow-sm border-slate-300
                             focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:placeholder:text-white'
              type='text'
              name='fullname'
              placeholder='Enter your name here'
              onChange={(e) => {
                setName(e.target.value);
              }}
              onBlur={() => {
                handleOnBlur(nameInputRef.current);
              }}
              ref={nameInputRef}
            />
          </p>

          <p className='flex sm:flex-row flex-col sm:gap-4 gap-2 focus-within:font-bold'>
            <label htmlFor='email' className='w-64'>
              Email:
            </label>
            <input
              id='email'
              className='
                             rounded w-full shadow-sm border-slate-300
                             focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:placeholder:text-white'
              type='email'
              name='email'
              placeholder='Enter your email address here'
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onBlur={() => {
                handleOnBlur(emailInputRef.current);
              }}
              ref={emailInputRef}
            />
          </p>

          <p className='flex sm:flex-row flex-col sm:gap-4 gap-2 focus-within:font-bold'>
            <label htmlFor='subject' className='w-64'>
              Subject:
            </label>
            <input
              id='subject'
              className='
                             rounded w-full shadow-sm border-slate-300
                             focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:placeholder:text-white'
              type='text'
              name='subject'
              placeholder='Enter a subject of your email here'
              onChange={(e) => {
                setSubject(e.target.value);
              }}
              onBlur={() => {
                handleOnBlur(subjectInputRef.current);
              }}
              ref={subjectInputRef}
            />
          </p>

          <p className='flex sm:flex-row flex-col sm:gap-4 gap-2 focus-within:font-bold'>
            <label htmlFor='message' className='w-64'>
              Message:
            </label>
            <textarea
              id='message'
              className='
                             rounded w-full shadow-sm border-slate-300
                             focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:placeholder:text-white'
              rows='8'
              name='message'
              placeholder='Enter your message here'
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onBlur={() => {
                handleOnBlur(messageInputRef.current);
              }}
              ref={messageInputRef}
            ></textarea>
          </p>

          <p
            className='absolute -z-10 w-px h-px inset-0 overflow-hidden'
            aria-hidden='true'
          >
            <label htmlFor='bot-check' className='flex gap-2 items-center'>
              <input
                id='bot-check'
                name='botcheck'
                type='checkbox'
                defaultChecked={inspector}
                onChange={(e) => {
                  setInspector(e.target.value);
                }}
                className='rounded'
              />
              Are you a human?
            </label>
          </p>

          <button
            className='
                         sm:ml-auto shadow-sm shadow-blue-900/50 rounded px-6 py-3 bg-blue-700 text-white font-bold uppercase text-xs tracking-wider
                         hover:bg-blue-800 hover:shadow-none hover:text-blue-50
                         active:bg-blue-900 active:text-blue-200'
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Send message
          </button>
        </>
      )}
    </form>
  );
};

/**
 * Component for the current page.
 */
export default function Contacts() {
  return (
    <main className='sm:space-y-8 space-y-4'>
      <ContactForm />
    </main>
  );
}
