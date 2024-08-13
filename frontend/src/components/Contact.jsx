import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

function Contact() {
  return (
    <div className="w-full bg-white ">
      <div>
        <div>
          <div className="w-full">
            <h2 className="text-3xl font-bold text-center  text-gray-900">
              Get in touch
            </h2>

            <div className=" text-gray-600 grid lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 gap-y-10 mt-20">
              <div className="flex lg:justify-center gap-x-4 items-center md:justify-start sm:justify-start ">
                <dt>
                  <span className="sr-only">Address</span>
                  <BuildingOffice2Icon
                    aria-hidden="true"
                    className="h-7 w-6 text-gray-400"
                  />
                </dt>
                <dd>
                  1528 Chapala Street, Suite 304 <br /> Santa Barbara, CA 93101
                </dd>
              </div>
              <div className="flex lg:justify-center gap-x-4 items-center md:justify-start sm:justify-start">
                <dt>
                  <span className="sr-only">Telephone</span>
                  <PhoneIcon
                    aria-hidden="true"
                    className="h-7 w-6 text-gray-400"
                  />
                </dt>
                <dd>
                  <a
                    href="tel:+1 (555) 234-5678"
                    className="hover:text-gray-900"
                  >
                    +1 (888) 437-3267
                  </a>
                </dd>
              </div>
              <div className="flex lg:justify-center gap-x-4 items-center md:justify-start sm:justify-start">
                <dt>
                  <span className="sr-only">Email</span>
                  <EnvelopeIcon
                    aria-hidden="true"
                    className="h-7 w-6 text-gray-400"
                  />
                </dt>
                <dd>
                  <a
                    href="mailto:hello@example.com"
                    className="hover:text-gray-900"
                  >
                    flowerempower@dreamfoundation.org
                  </a>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
