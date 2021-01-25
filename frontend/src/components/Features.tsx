import React from "react";

export const Features = () => {
  return (
    <div>
      <div className="content">
        <div className="container-fluid">
          <div className="col-lg-6 col-lg-offset-0 col-md-6 col-md-offset-0 col-sm-10 col-sm-offset-1 col-xs-12">
            <figure>
              <div className="media"></div>
              <figcaption>
                <svg
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <mask height="100%" id="mask" width="100%" x="0" y="0">
                      <rect
                        height="100%"
                        id="alpha"
                        width="100%"
                        x="0"
                        y="0"
                      ></rect>
                      <text className="title" dx="50%" dy="2.5em">
                        GET
                      </text>
                      <text className="title" dx="50%" dy="3.5em">
                        STARTED
                      </text>
                      <text className="title" dx="50%" dy="4.5em">
                        NOW
                      </text>
                    </mask>
                  </defs>
                  <rect height="100%" id="base" width="100%" x="0" y="0"></rect>
                </svg>
                <div className="body">
                  <p>It is free, easy and fast</p>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="card-container">
          <div className="card">
            <div className="card-icon">
              <img
                className="weights"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAELUlEQVR4nO2dzY8URRiHnyzZP2EvIAscFjVy0htmzRzhDguJ/hUe8OCFI55QOBESLxpvcABi9GIIunfPfIgJJuKShbBgWHYmWQ+1HYemuqeru6q6avr3JH2Z6a/3faarq3vqA4QQQgghhBBCpMIq8DPwDHgAXAGWatY/AHwF/A5sAPeA74DjYU8zPxaARcdtzgJjYLe03AeWLeufBF5Y1i+Wi8C+Fuc+VxwFbgJbwDawDowabFclo1ge8LaUw8DDmm12gUudosmcD4FN3k7KGDhTs91ZYGLZzpeUJj+IueMj4CnVSamS8j7NZHSRcs1PiPnwLvYro6mUcw227SLlsZcoM+IWzZPZh5RXXqLMhAXMDdwlmbGl3PURaC4sYmpTLomMLeUbH4HmxDruQmJJ2QIOeokyI0bUP0P0KeWEnxDz4xTtpUyAzyz7/NxxP38CR0IElyuSkiCSkiCSkiCSkiBn6L/2dZ/6/1MGRwpSrgaJLGP6lrIRJqy86VPKv4Fiyp6+pPwSKqB5ILaUHeDjYNHMCbGqxBPg04BxzBWhpVStI/b4wPJZqOJrgmk4ISooEn/e8t0a/qW85/f054vTvJnwC5Z1QhRfwkJZhqT0yKz7Q6ziS1B9ZcS4UlTNLdFUhqREoE01dgwcs+yra/G1FiC+rGgro67c7yJlB9PXZJCEkFHQRcqvPoLLjZAyCtpKGWOaug6GGDIK2kjZahdWnsSUUeAq5fsOx8qKPmQUNJXyCNjv4XjJ4/qcsYv/Z4NTmFpU1fH+xvTMmnv6vDLKrGGX8ghYCXC85EhJRsEqcAcj5jmmf7qKqYpFrzACIRk17Ae+xXRO2QB+JGyLihSLqWRYwdywygnYIcyLNMmoYQX4i3hFhIqpGt6hXsb0r9PHlaIrYwY/4JaYLlIkowEvcU9QGymS0YAF3AZmaStFMhz4DXchLlIkw5FPCPffsmS0pGsbWJuUYy32KRlThGga84WHfQyavqRIRg2xpUhGA2JJkQwHQkuRjBnYOqGEqH2dR7WpmRTj2p6zfBeiW5it+5nYo/wq/EvLOmotHomq/yUkpQdWqW97FKv4EnvcZnYSJSUir2iWREmJxBOaJ1FSInAVtyRKSmCWMMPTSUpCHMRdSogqsTrlTyEpCSIpCSIpCSIpPXMSM+XCNMuY1u8uSQxR+xrczGeHMK0WH5KmlHUvUWbEZf4PPkUp27jP5Jk15WSHluLaZPU5AxslwTbRVkgps6Y+LS83vESZEf9gT0QKxdcmA+l6PM11qhPiQ8oEe+f6WVI2MXPeDo4R9QntImXWuLZVUgYro+Br/EsZ02yQ4RGmaruNuYHfYIDFVJkFzCyVVcl9gXl4LLOM/Yl+B/cRnxcZWG2qCSPMFNSPgdeYZF+ifgbLJeAK8AdmWu2f0CwBQgghhBBCCJEM/wEJ0QXVNHpkBAAAAABJRU5ErkJggg=="
              />
            </div>
            <div className="text-content">
              <span className="card-title">
                <strong>Share</strong>
              </span>
              <p>Share your workout routines, training progress and more!</p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon">
              <img
                className="comments"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAC2UlEQVRoge2ZO2gUQRjHf0m8M+AjjSBJoyYgRLCJUVDwFSHVBRstLHwECwutvQMFQUIKCwtFQYOaRlEkWImgmIiCD7AXRfARIyKikERNCrMW8y2zd8zu3lwudxOYP2xx32v+/5vZmd1vwcPDwxZ9wBgwDQSOXdPAKJBLEzHoANlyr4E4EX0SMAucBNrSVNcBbUAexTEgZmbGxJmvHa+KUUBxfWxyTomztZaMKkQriuukyRmuvcWCIr6NdSRSVXghrsELcQ1eiGvwQlyDF+IavBDX4IW4Bi/ENXghDuAqMGNyLLZ3doDVJmM9hOwE7gATqF7VOHAT2BqJ2QbcAr5IzARwG9gRV7SWQjLAEMmdxEvA5ZSYK1KrCLUUcg3dyz0FtANZoAM4i+4khp3PQWA9sFRiT6N700OlxcMG3UK3SvfIOFNAd0xMD0rALLA7JqYbzbkoZlSMhSqQTcJImePkSW/fhq3Tu1FjDj2VBRZuZr7JOGtS4prkSsJaqfW11DFAejv/UUzRRuBJQl54U87I7+YUkuWgWWr9NTlzqC53uP5MV4shb29CfIDe8z/K73VVENIutT7YJr6TxA0l9kbglfhOpNR4IHGHbQc3oF9q3bdNfCOJnSX2Y+h/JptS46jEPgcabAlE0AC8kFr9NolLUN8jossEYAtqjQbA/jLqrEDdnAFwyIZACY5IjXFgmU3idkl8H7H1AL/EfsGi1kH0gdhlQ0LQhT4Q99kkNgEv0R8hVwIXgTmxjWB4VEhB+IjyE9hlkbcZ+CG5520GXI46cMLd5x763/gHnKOy14Gs1ArPrnKW2QHgt+RcJ/2cKcJTzNvpM9T9MR9khFBY8wbmrb0FGJaYOdSqsN4oHqJm4C3qfDkDbKyEdQKOA39QRD8DvRFfr9gC4DvqvHIancBr9OwMo2chXNLGFykXkUHNePQxfpLqHJ51wSbgE+ppoaPOXOaNVagXqbLwH3JTNJZCcMwFAAAAAElFTkSuQmCC"
              />
            </div>
            <div className="text-content">
              <span className="card-title">
                <strong> Comments</strong>
              </span>
              <p>
                Comment and motivate others to do their routines and improve
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon">
              <img
                className="help"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAEw0lEQVRogdWaW4hWVRTHfzo1zShlKZniDDnSlSgowktp2W2ULhA9REIk9BBCj3mpDPIhojsk9FJoEBaNQz009aIRlF0Mo3umRY5WTk5pjhOYjuOcHtbanX3Ot89tf+ecqT8cvjlr7bPWf+2z195r7zMwfjgd+AjYBawA2saRizcmAJuBwLoGgXXAWePIqzDWIuQPA/cDXxEGdBh4HJg+buxyohsYBU4Ct1jyhUAfYUDHgFeAC+ommAe3AUcQomsT2iwE3gbGtN0JYBNwaR0EkzAFWA5sAH4k7O1NSJ6k4TLgVSSQAAmsD7i6KrIutAOPAX8RTeg/gQeBlgK2uoAXgKOWnQ+Am8nujKbQBXxrOX0fWAPMB1qbsHsOMgkMWba/BJZRrGNyoRP4VZ18D9xQtgPgDKRjfiMM6JMyHbQAn6rhz4AzyzTuQBvwjvr7ukzDK9TofmBqmYYTcB6SN2PANWUZbQH2IIHcW5bRDGxVfxvKNHqrGv2JChLPgbvV3+/ANF8jk4D7kNnoANHp9aHmOWZiGhJAANzja+QKpFoNHNcIMKNpmtnYqP7ew3MduQhZ0Mz8fScyt5sC8I1SaKZjMZLcx4ALfQy0ATsJCZ+m8olAv8qXJDx7JWF9Vdb1LnCKTyBPES5y7ZZ8qcr3aFAu9JQchLm2FA1mHlJ2jwILYro31ejDCc9OB44j+TOziNMEtCLVgpnqV+Z90B5ST8d0M5HKNI3kKqrJn8Vq95u8DzyhD+wiOqQgO8knAD+Qnj++mKR2h/I0nks4pK6K6ewkX5rw/PVk548vriPM2VTMRVbpAHjGob9Wdf0kk3yd9PzxQStwI7A3y3Yb8CTyFgLgCxqHFEgZHQAvJtg5m3KT3FTV8SnYLAOR3lyAEF+NjO/nkCH1t8OwWVFPJDhejvTeW8i+oVmcGrs/CNyOdNa/aEeGj3kLu2nMiTi6te3PyEbHxhTgF9V3+7BOQHxYPRJv8LEqTgLP4h5KcbQgU18AfIjUYK3A5Xpvdm1V7KlNJ+6OK/ar4o6CBi9BTgddq+5eZO9eBaaqj6O2cCKSSFD87PU75E28hIxZgAHgeaS+6vdlmoF5+rsvrliNRLi+SQeVHs0gQ/cmJC8D5FgpgkWq2FExEV+4pt6tOI6W2pH5foR8iV43PicaxB/A5KTGO7TRolqoFYcZVvtIPzdmvTZYVQ8vbywhLGIjMCu7OambXxcjT5g87kxq0IVEOlALHX+YN7IzrZE5Sz23DkYFYcoTkyNr0hqbbetd1fPKhYuJnrzbe/WGqdeufrfr738pT8Zi9weRUmok7SGzMG5PadMB9ALDyBHPZiS/5ujfRzzkw8h2+fwEn+bAwexIH00LAsKF8TjuuqsDOETjqx7EXTwWlR8CZqXws7fOmTALo2s/0qu6PnU4C/loGZQo70nhNlnbjOYJxCyMDzh0w6qze63TIlaGPO1UxLyRXFX1Mm3c69AZAnXLTY6YneE6R5sGmIUx7aqKcJbfANhGgcJ2S4Yx+9OBPVQ6mpDPSPE3inyjX4nnwXUcLxMmaYde5mNkgCSsr9wk+8YyiGZhNtFPwuY6gHs6LSofoMbyaA7wmhIZQk4TZyO51YMscEXlg8i/alR1WPH/wj+i2AJEI7dbOwAAAABJRU5ErkJggg=="
              />
            </div>
            <div className="text-content">
              <span className="card-title">
                <strong>Socialize</strong>
              </span>
              <p>
                Meet and help others to improve and get started, no pain no
                gain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
