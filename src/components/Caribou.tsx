import { cn } from "@/lib/utils";
import { robotoMono } from "@/ui/fonts";

export default function Caribou({ className }: { className?: string }) {
    return (
        <pre className={cn(`${robotoMono.className} w-fit h-fit whitespace-pre-wrap text-[0.2rem] self-center text-primary`, className)}>
{`

                                   #=..::.                                                       ..:..=#
                                     #=--*                                                       *=-=#
                                  #:.:::.-                                                       -.:::.:#
                                 *:.:::.:#                      #*+---:-+*#                      #:.:::.:#
                                 :.:::.:#       ###          #+-.:-=====-:.-*#           ##       #:.:::.-
                                #..:::.*      *:..-       #+-.:==++++++++==-:.-*        :..:*      *..::.:
                                 -.:::.:#    *..:.:     *-.:=++++++++++++++++=-:.=#     :.:..#    #:.:::.+
                                 #=..::..-+*#:.:..*   +:..:::-=++++++++++++++++==-.:*   + ::.:#*=:.:::..+
                                   #=:.::::...::..# +::-+++++=-:=+++++++++++++=.-==-.:* =.:::...:::..:+#
                                     #*+-:.::::::.::.-++++++++++++++++++++++++-.-++==-.-..:::::..:-+#
                                          #+-..:::.:--:::--+++++++++++++++++-.-++++-===: .::..-+#
                                              +:. .:-=+++=:=+++++++++++++++++++++++=-:::. .:+#
                                              +..-=++++++++++*****************+++++++++=-:..*
                                            #=.-+++++++++*************************+++++++++-.=#
                                            -.=++++++********************************+++++++=.-
                                           =.=+++++*************************************+++++=.-
                                          =.-++++****************************************+++++=.=
                                         +.=++++*******************************************++++=.=
                                        =.=+++**********************************************++++=.=
                                       -.=+++*************************************************+++=.-#
                                      =.=+++***************+==-::........:::-=++***************+++=.-
                                     =.-+++********+=--:...::--=============--::...::-=+********+++=.=
                                    *.:++++***+=-:.     ...... .:==++++++=-....::::.    .:-=+***++++-.*
                                    :.++++++-.   .::::: :===+++-.  ......  :====---..:::..  ..-++++++..#
                                   *.-++++:.:-=. -=====- :==++++:  -----: .++++++=.:======  =-:.:++++-.*
                                   +.=++=.:====. -======- -=++++. :++++++. :++++=::======- .====:.=++-.+
                                   *.-++..=====- .=======:.=++-..:+++++++=. :=++:.=======. :=====..++:.*
                                    -.++..======-:........ ....-=++++++++++=:... ...::....-======: ++.:
                                    #.:+- -====+==========- =+++++++++++++++++= -========++======.:+-.#
                                     +.=+-.-=++++++++++++==:.+++++++++++++++++::==+++++++++++++=..+=.+
                                      -.=+=.:=+++++++++++++= =+++++++++++++++= ==++++++++++++=:.-++.:
                                      #..=++=::=++++++++++++::++++++==+++++++::=+++++++++++=:.-++=:.*
                                   *+-..-::=+*+-:-=+++++++++=.--:.........::-.=++++++++++-::=**+::-..:-+#
                               #*=.:-==.:++-:=***+-.-+****+++:...............:+++****+-::=***+::=+=.:+=-.:=*
                             #-.:-=++++=.-+**=--+***+-.-=***++...............=+***+-:-+*##*=-=+**=::+*+++=-::+#
                           *-.-=+++++***+-:-+***+=++*##+-:-=*++-...........-+**+-:-+*##*+==***+=::+******+++=-.-*
                         *:.-++++++********+=---=+*#***###*=:-=+++--:...:=+++-:-+####*+*##+=--=+***********+++=-::*
                       *-.-++++++*************##***##########*=::==-::.  ...:=##########****######***********+++==::*
                      =.-=++++++*************############*++-=+#*=.....::.-*##*++++*################**********++++=-.-#
                    #:.=+++++++*************################-.::+##=..:.-*###=:::-####################**********++++=:.+
                   +.-=++++++***************################:-+=*####=-*######----####################***********++++==.-#
                  +.-+++++++****************################:-+=##############:--:#####################***********+++++=::*
                 +.-+++++++****************################*:-+-##############:-=:######################***********+++++=:.*
                =.::=+++++*********+*******################*.-+-##############-:=-*####################*+***********++++-.:.*
              #-.-+=::-++*********+.********###############*.=+-##############-:=-*####################*.************+-.-==:.*
             #-.:=++++-:-+********=.*******################*.=+-##############-:==+####################*.=*********=::-+++==:.+
            #-.=-:.:=+++=-:=+*****-.*******################*.=+-##############-:==+#####################::******+-:-++++-:::--.+
           #=.=++++=-::=+++=--+***::*********##############*.=+-##############-:-==####################*-.****=:-=+++-::-=+++=-.*
           =.-+++++++++=-:::::.:::..::::::::::::::::::::::::....::::::::::::::.....:::::::::::::::::::::. .::..:::::-=++++++++=-.*
          +.-++++++++++++-                                                                                         -+++++++++++=:.#
         *.-=++++++++++++-                                                                                         -++++++++++++=:.#
        *.-=+++++++++++++-            ..................................                                           -+++++++++++++=::#
       #.:=++++++++++++++=            .........::::::::::::::::::::::::.                                           =++++++++++++++=.:
       :.==++++++++++++++=                                                                                         +++++++++++++++=-.=
      =.-=+++=========++++.                                                                                       .++++==-------=++=-
     *.:=+++-........ ..:-.                                                                                       .-:.....::---==+++=.
    #:.=+++++++===--::::::.           ......................:::::::::::::::::::.                                  :::::..:::::.:-==++=
    =.-=++++=-:..:--=+++++-           ..........................................    .........                     -+++++==-:..:-=-::==
   #.:=+++-..-=+++++++++++=           .::::::::::::::::::::::::::::::::::::::::::::::::::::::.                    =+++++++++++=:.:==-=
   =.==+=-:=+++++++++++++++.          .:::.:::::::::::::::::::::::::::::::::::::::::::.                          .+++++++++++++++-:===
   -.======++++++++++++++++:           ...... ....                                          .::::::::            .+++++++++++++++++===
   -.=======+++++++++++++++-           ..........:     ...........................          .........            :+++++++++++++++=====`}
          </pre>
    )
}