/**
 * v0 by Vercel.
 * @see https://v0.dev/t/UY5M2V1xqU6
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div key="1" className="flex flex-col h-[400px] rounded-t-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 px-4 py-4">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <img
              alt="Profile Picture"
              className="rounded-full border-dashed border-2 border-gray-300"
              height={64}
              src="/placeholder.svg"
              style={{
                aspectRatio: "64/64",
                objectFit: "cover",
              }}
              width={64}
            />
          </div>
          <div className="font-semibold text-lg text-center py-2">Temi Puja - Barre Client</div>
          <div className="flex flex-col items-start">
            <div className="flex flex-col max-w-[75%]">
              <div className="rounded-lg rounded-tl-none bg-gray-100 dark:bg-gray-900 p-4 text-sm break-words">
                Hi Emma. This Saturday I have to run a personal errand. So cannot come to our evening class.
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 minutes ago</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex flex-col max-w-[75%]">
              <div className="rounded-lg rounded-br-none bg-gray-100 dark:bg-gray-900 p-4 text-sm break-words">
                Hi, Temi! Hope you are doing well!
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 minute ago</div>
            </div>
            <div className="flex flex-col max-w-[75%]">
              <div className="rounded-lg rounded-br-none bg-gray-100 dark:bg-gray-900 p-4 text-sm break-words">
                Thanks for letting me know. Girls will miss you. In the meantime, do you want me to schedule you a make
                up class, perhaps next week?
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Just now</div>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex flex-col max-w-[75%]">
              <div className="rounded-lg rounded-tl-none bg-gray-100 dark:bg-gray-900 p-4 text-sm break-words">
                Absolutely! If you can put me in a make up class anytime on Thursday that would be great!
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Just now</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex flex-col max-w-[75%]">
              <div className="rounded-lg rounded-br-none bg-gray-100 dark:bg-gray-900 p-4 text-sm break-words">
                What about Thursday evening class at 7?
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Just now</div>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex flex-col max-w-[75%]">
              <div className="rounded-lg rounded-tl-none bg-gray-100 dark:bg-gray-900 p-4 text-sm break-words">
                Yes! That works. Thank you, Emma!
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Just now</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex flex-col max-w-[75%]">
              <div className="rounded-lg rounded-br-none bg-gray-100 dark:bg-gray-900 p-4 text-sm break-words">
                You are welcome! See you on Thursday!
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Just now</div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4 p-4">
          <Input className="flex-1 border border-orange-500" placeholder="Message" />
          <Button className="bg-orange-500 text-base font-open-source text-sm" size="md">
            Send
          </Button>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <span className="cursor-pointer text-orange-500 hover:text-green-500" onClick={undefined}>
            <span className="font-semibold italic">Little Help</span>
            is turned on. Switch off
          </span>
        </div>
      </div>
    </div>
  )
}
