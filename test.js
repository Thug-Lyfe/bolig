//const functions = require('firebase-functions')
const cors = require('cors')({origin:true})

const fs = require('fs');
const cheerio = require('cheerio')
const getUrls = require('get-urls')
const fetch = require('node-fetch')
const TurndownService = require('turndown');
const express = require('express')
const turndownService = new TurndownService()
var turndownPluginGfm = require('turndown-plugin-gfm')
var gfm = turndownPluginGfm.gfm
turndownService.use(gfm)

var test = {
    0: "https://www.boliga.dk/bolig/1651747/albertslundvej_105__2_mf_2625_vallensbaek",
    1: "https://www.boliga.dk/bolig/1734394/albertslundvej_105_st_mf_2625_vallensbaek",
    2: "https://www.boliga.dk/bolig/1702484/albertslundvej_107_1_mf_2625_vallensbaek",
    3: "https://www.boliga.dk/bolig/1755769/algade_62__1_th_4000_roskilde",
    4: "https://www.boliga.dk/bolig/1676547/azaleagangen_54_2300_koebenhavn_s",
    5: "https://www.boliga.dk/bolig/1762456/baunevej_135_2630_taastrup",
    6: "https://www.boliga.dk/bolig/1759547/bavneaasen_14_2640_hedehusene",
    7: "https://www.boliga.dk/bolig/1748524/berings_gade_2_1_tv_2630_taastrup",
    8: "https://www.boliga.dk/bolig/1756377/berings_gade_28_2_tv_2630_taastrup",
    9: "https://www.boliga.dk/bolig/1739292/berings_gade_4_2_th_2630_taastrup",
    10: "https://www.boliga.dk/bolig/1737533/berings_gade_6_2_tv_hoeje_taastrup_2630_taastrup",
    11: "https://www.boliga.dk/bolig/1760616/birkevang_61_floeng_2640_hedehusene",
    12: "",
    13: "https://www.boliga.dk/bolig/1744497/bispehusene_28_2620_albertslund",
    14: "https://www.boliga.dk/bolig/1760020/bispehusene_33_2620_albertslund",
    15: "https://www.boliga.dk/bolig/1755231/bluevang_alle_4a_2610_roedovre",
    16: "https://www.boliga.dk/bolig/1744049/bogholder_alle_27c_2_tv_2720_vanloese",
    17: "https://www.boliga.dk/bolig/1719189/boserupvej_2_1_tv_2700_broenshoej",
    18: "https://www.boliga.dk/bolig/1757114/bredekaers_vaenge_102_2635_ishoej",
    19: "https://www.boliga.dk/bolig/1742145/bredekaers_vaenge_112_2635_ishoej",
    20: "https://www.boliga.dk/bolig/1760656/bredekaers_vaenge_32_2635_ishoej",
    21: "https://www.boliga.dk/bolig/1749956/bronzealderen_2b_1_floeng_2640_hedehusene",
    22: "https://www.boliga.dk/bolig/1752320/broendbyvestervej_10_1_c_2600_glostrup",
    23: "https://www.boliga.dk/bolig/1760801/broendbyvestervej_34_st_tv_2605_broendby",
    24: "https://www.boliga.dk/bolig/1758998/centerparken_14_1_th_2500_valby",
    25: "",
    26: "https://www.boliga.dk/bolig/1759250/dommervaenget_14d_2_th_4000_roskilde",
    27: "https://www.boliga.dk/bolig/1759841/dommervaenget_14d_1_th_4000_roskilde",
    28: "https://www.boliga.dk/bolig/1760132/edithsvej_1c__1_tv_2600_glostrup",
    29: "https://www.boliga.dk/bolig/1753982/egeskoven_240_2_2_2600_glostrup",
    30: "https://www.boliga.dk/bolig/1750238/egevangshusene_75_2630_taastrup",
    31: "https://www.boliga.dk/bolig/1734535/elmehusene_14_2600_glostrup",
    32: "https://www.boliga.dk/bolig/1756434/elmehusene_153_2600_glostrup",
    33: "https://www.boliga.dk/bolig/1747698/elmehusene_218_2600_glostrup",
    34: "https://www.boliga.dk/bolig/1744018/elmehusene_306_2600_glostrup",
    35: "https://www.boliga.dk/bolig/1753037/elmehusene_77_2600_glostrup",
    36: "https://www.boliga.dk/bolig/1746144/emdrupvej_155__2_th_2400_koebenhavn_nv",
    37: "https://www.boliga.dk/bolig/1742817/enghavevej_15_st_th_1674_koebenhavn_v",
    38: "https://www.boliga.dk/bolig/1762605/falkehusene_57_2620_albertslund",
    39: "https://www.boliga.dk/bolig/1725730/fasanhusene_29_2620_albertslund",
    40: "https://www.boliga.dk/bolig/1752760/filosofvaenget_2__st_th_2400_koebenhavn_nv",
    41: "https://www.boliga.dk/bolig/1752761/filosofvaenget_2__st_tv_2400_koebenhavn_nv",
    42: "https://www.boliga.dk/bolig/1748720/floengvaenget_49_2640_hedehusene",
    43: "https://www.boliga.dk/bolig/1741809/frederikssundsvej_330__1_mf_2700_broenshoej",
    44: "https://www.boliga.dk/bolig/1756811/frederikssundsvej_416_st_th_2700_broenshoej",
    45: "https://www.boliga.dk/bolig/1763380/fyrrelunden_39_2635_ishoej",
    46: "https://www.boliga.dk/bolig/1753618/fyrrelunden_87_2635_ishoej",
    47: "https://www.boliga.dk/bolig/1743602/faengselsvej_8_2620_albertslund",
    48: "https://www.boliga.dk/bolig/1751576/gammel_kalkbraenderi_vej_23_st_2100_koebenhavn_oe",
    49: "https://www.boliga.dk/bolig/1715925/gammel_koege_landevej_266f_st_tv_2650_hvidovre",
    50: "https://www.boliga.dk/bolig/1734602/gammel_koege_landevej_374_1_mf_2650_hvidovre",
    51: "https://www.boliga.dk/bolig/1741926/gammel_vindingevej_19_4000_roskilde",
    52: "https://www.boliga.dk/bolig/1753233/gammelgaards_alle_17_2_28_2665_vallensbaek_strand",
    53: "https://www.boliga.dk/bolig/1644211/gildbrovej_41_3_320_2635_ishoej",
    54: "https://www.boliga.dk/bolig/1753108/gl_raadhusvej_54__1_tv_2750_ballerup",
    55: "",
    56: "https://www.boliga.dk/bolig/1727570/granlunden_63_2635_ishoej",
    57: "https://www.boliga.dk/bolig/1748951/guldsmedestraede_2_1_th_naerheden_2640_hedehusene",
    58: "https://www.boliga.dk/bolig/1748954/guldsmedestraede_4_1_th_naerheden_2640_hedehusene",
    59: "https://www.boliga.dk/bolig/1748956/guldsmedestraede_4_2_th_naerheden_2640_hedehusene",
    60: "https://www.boliga.dk/bolig/1748957/guldsmedestraede_4_2_tv_naerheden_2640_hedehusene",
    61: "https://www.boliga.dk/bolig/1748953/guldsmedestraede_4_st_tv_naerheden_2640_hedehusene",
    62: "https://www.boliga.dk/bolig/1748961/guldsmedestraede_6_1_th_naerheden_2640_hedehusene",
    63: "https://www.boliga.dk/bolig/1748958/guldsmedestraede_6_1_tv_naerheden_2640_hedehusene",
    64: "https://www.boliga.dk/bolig/1748962/guldsmedestraede_6_2_th_naerheden_2640_hedehusene",
    65: "https://www.boliga.dk/bolig/1748960/guldsmedestraede_6_st_tv_naerheden_2640_hedehusene",
    66: "https://www.boliga.dk/bolig/1759248/gyngemose_parkvej_59_3_th_2860_soeborg",
    67: "https://www.boliga.dk/bolig/1748899/gyvelvej_12b_st_th_4000_roskilde",
    68: "https://www.boliga.dk/bolig/1761003/hallandsparken_15_2630_taastrup",
    69: "https://www.boliga.dk/bolig/1758536/hedekaeret_12__1_tv_2640_hedehusene",
    70: "https://www.boliga.dk/bolig/1763428/hedekaeret_87_2_tv_2640_hedehusene",
    71: "https://www.boliga.dk/bolig/1754524/hedetoften_47__1_tv_2640_hedehusene",
    72: "https://www.boliga.dk/bolig/1641562/holmbladsgade_112__1_2300_koebenhavn_s",
    73: "https://www.boliga.dk/bolig/1758256/holmbladsgade_112_3_3_sal_2300_koebenhavn_s",
    74: "https://www.boliga.dk/bolig/1735106/hovedgaden_395_2640_hedehusene",
    75: "https://www.boliga.dk/bolig/1744110/hovedgaden_455_1_2640_hedehusene",
    76: "https://www.boliga.dk/bolig/1713574/hovedgaden_478_2640_hedehusene",
    77: "https://www.boliga.dk/bolig/1746423/hulkaervej_36_2640_hedehusene",
    78: "https://www.boliga.dk/bolig/1757767/hundige_bygade_49_2670_greve",
    79: "https://www.boliga.dk/bolig/1684433/husmandsvej_6_2630_taastrup",
    80: "https://www.boliga.dk/bolig/1744201/husumgade_49_st_th_2200_koebenhavn_n",
    81: "https://www.boliga.dk/bolig/1751223/hvidovrevej_221a_1_5_2650_hvidovre",
    82: "https://www.boliga.dk/bolig/1728299/hvidovrevej_73b__1_2650_hvidovre",
    83: "https://www.boliga.dk/bolig/1745099/hyltebjerg_alle_64a_st_tv_2720_vanloese",
    84: "https://www.boliga.dk/bolig/1750039/haabets_alle_7_2_tv_2700_broenshoej",
    85: "https://www.boliga.dk/bolig/1755166/hoejagerparken_29__1_tv_2750_ballerup",
    86: "https://www.boliga.dk/bolig/1751100/hoeje_taastrup_boulevard_13_2_tv_2630_taastrup",
    87: "https://www.boliga.dk/bolig/1736241/islevhusvej_83_2_2700_broenshoej",
    88: "https://www.boliga.dk/bolig/1746848/istedgade_55_3_th_1650_koebenhavn_v",
    89: "https://www.boliga.dk/bolig/1761610/jernbane_alle_13_2_tv_2720_vanloese",
    90: "https://www.boliga.dk/bolig/1763581/jyllingevej_66_3_tv_2720_vanloese",
    91: "https://www.boliga.dk/bolig/1749055/jyllingevej_68__2_th_2720_vanloese",
    92: "https://www.boliga.dk/bolig/1753578/klokkerhaven_2c_st_th_2750_ballerup",
    93: "https://www.boliga.dk/bolig/1740625/klovtoftegade_26_klovtofte_2630_taastrup",
    94: "https://www.boliga.dk/bolig/1740542/klovtoftegade_28_klovtofte_2630_taastrup",
    95: "https://www.boliga.dk/bolig/1738042/knud_den_stores_vej_34_st_102_4000_roskilde",
    96: "https://www.boliga.dk/bolig/1746685/kongelysvej_19_naerheden_2640_hedehusene",
    97: "https://www.boliga.dk/bolig/1753420/koebenhavnsvej_95_4000_roskilde",
    98: "https://www.boliga.dk/bolig/1753419/koebenhavnsvej_97_4000_roskilde",
    99: "https://www.boliga.dk/bolig/1763287/koegevej_40__st_4000_roskilde",
    100: "https://www.boliga.dk/bolig/1715755/landlyst_vaenge_88_2635_ishoej",
    101: "https://www.boliga.dk/bolig/1762358/landlystvej_65h_2_th_2650_hvidovre",
    102: "https://www.boliga.dk/bolig/1713569/landsbygaden_25_st_sengeloese_2630_taastrup",
    103: "https://www.boliga.dk/bolig/1763281/landsbygaden_33_2630_taastrup",
    104: "https://www.boliga.dk/bolig/1734806/landskronagade_60_st_th_2100_koebenhavn_oe",
    105: "https://www.boliga.dk/bolig/1760649/langekaervej_15_2750_ballerup",
    106: "https://www.boliga.dk/bolig/1759733/lauggaards_alle_4__st_tv_2860_soeborg",
    107: "https://www.boliga.dk/bolig/1722410/leen_a_1_3__nr_2_hoeje_taastrup_2630_taastrup",
    108: "https://www.boliga.dk/bolig/1758400/lilliendalsvej_7_1_1_2600_glostrup",
    109: "https://www.boliga.dk/bolig/1729956/lindebo_11_2_72_2630_taastrup",
    110: "https://www.boliga.dk/bolig/1719964/lindebo_5_st_25_2630_taastrup",
    111: "https://www.boliga.dk/bolig/1758608/lindevangshusene_56_1_th_2630_taastrup",
    112: "https://www.boliga.dk/bolig/1682541/lindevangshusene_84__1_th_2630_taastrup",
    113: "https://www.boliga.dk/bolig/1738419/lindevangshusene_86_2_th_2630_taastrup",
    114: "https://www.boliga.dk/bolig/1753743/lindevangshusene_96_1_th_2630_taastrup",
    115: "https://www.boliga.dk/bolig/1727956/lyngevej_4_floeng_2640_hedehusene",
    116: "https://www.boliga.dk/bolig/1750030/masnedoegade_2b_1_12_2100_koebenhavn_oe",
    117: "https://www.boliga.dk/bolig/1746700/mejeristraede_2_4000_roskilde",
    118: "https://www.boliga.dk/bolig/1760647/mosevej_15__st_th_2860_soeborg",
    119: "https://www.boliga.dk/bolig/1738047/munktoftevej_20a_2610_roedovre",
    120: "https://www.boliga.dk/bolig/1762149/murskeen_1_1_1_2630_taastrup",
    121: "https://www.boliga.dk/bolig/1668773/moerkhoejvej_101_1_tv_2860_soeborg",
    122: "https://www.boliga.dk/bolig/1759907/niebuhr_gade_23_2_th_2630_taastrup",
    123: "https://www.boliga.dk/bolig/1755278/niebuhr_gade_23_st_tv_2630_taastrup",
    124: "https://www.boliga.dk/bolig/1745094/niebuhr_gade_29_2_th_2630_taastrup",
    125: "https://www.boliga.dk/bolig/1753990/nordengen_2_2630_taastrup",
    126: "https://www.boliga.dk/bolig/1751608/nyborggade_16_st_2100_koebenhavn_oe",
    127: "https://www.boliga.dk/bolig/1742702/naesborgvej_52_st_tv_2650_hvidovre",
    128: "https://www.boliga.dk/bolig/1750241/naesborgvej_76_st_tv_2650_hvidovre",
    129: "https://www.boliga.dk/bolig/1570994/ouroegade_42_st_tv_2100_koebenhavn_oe",
    130: "https://www.boliga.dk/bolig/1744963/parkvej_137_1_tv_2630_taastrup",
    131: "https://www.boliga.dk/bolig/1747123/parkvej_143_2_th_2630_taastrup",
    132: "https://www.boliga.dk/bolig/1760444/pile_alle_2a_st_th_2630_taastrup",
    133: "https://www.boliga.dk/bolig/1759500/poppellunden_15_2635_ishoej",
    134: "https://www.boliga.dk/bolig/1749014/poppellunden_33_2635_ishoej",
    135: "https://www.boliga.dk/bolig/1759137/rebaek_soepark_13_1_th_2650_hvidovre",
    136: "https://www.boliga.dk/bolig/1760037/rebaek_soepark_15_st_th_2650_hvidovre",
    137: "https://www.boliga.dk/bolig/1735876/reerslevvej_17_st_th_2640_hedehusene",
    138: "https://www.boliga.dk/bolig/1761582/ringstedvej_69__st_4000_roskilde",
    139: "https://www.boliga.dk/bolig/1755057/rosenlyparken_122_2670_greve",
    140: "https://www.boliga.dk/bolig/1759205/rosenlyparken_158_2670_greve",
    141: "https://www.boliga.dk/bolig/1749919/rosenlyparken_161_2670_greve",
    142: "https://www.boliga.dk/bolig/1756326/rosenlyparken_201_2670_greve",
    143: "https://www.boliga.dk/bolig/1750519/roskildevej_100__st_tv_2000_frederiksberg",
    144: "https://www.boliga.dk/bolig/1755159/roskildevaenget_12__2_th_4000_roskilde",
    145: "https://www.boliga.dk/bolig/1754811/roskildevaenget_26_2_tv_4000_roskilde",
    146: "https://www.boliga.dk/bolig/1752711/roskildevaenget_27_2_tv_4000_roskilde",
    147: "https://www.boliga.dk/bolig/1760664/roskildevaenget_64__1_tv_4000_roskilde",
    148: "https://www.boliga.dk/bolig/1736140/rybjerg_alle_9_2860_soeborg",
    149: "https://www.boliga.dk/bolig/1759729/rytterhusene_34_2620_albertslund",
    150: "https://www.boliga.dk/bolig/1753916/roedovre_parkvej_181_st_tv_2610_roedovre",
    151: "https://www.boliga.dk/bolig/1752402/roedovre_parkvej_185_1_tv_2610_roedovre",
    152: "https://www.boliga.dk/bolig/1756439/roedovrevej_165_2_th_2610_roedovre",
    153: "https://www.boliga.dk/bolig/1754417/roedovrevej_303_st_th_2610_roedovre",
    154: "https://www.boliga.dk/bolig/1761566/roennevej_12_floeng_2640_hedehusene",
    155: "https://www.boliga.dk/bolig/1754520/roerholmsgade_2b__2_tv_1352_koebenhavn_k",
    156: "https://www.boliga.dk/bolig/1762221/sankt_olavs_alle_78_2630_taastrup",
    157: "https://www.boliga.dk/bolig/1726342/sejeroevej_1_vor_frue_4000_roskilde",
    158: "https://www.boliga.dk/bolig/1759999/signalvej_163__1_th_2860_soeborg",
    159: "https://www.boliga.dk/bolig/1725916/skagensgade_14_2630_taastrup",
    160: "https://www.boliga.dk/bolig/1736659/skjeberg_alle_43_3_2630_taastrup",
    161: "https://www.boliga.dk/bolig/1762819/skyttehusene_37_2620_albertslund",
    162: "https://www.boliga.dk/bolig/1763085/slotsherrensvej_1_3_th_2720_vanloese",
    163: "https://www.boliga.dk/bolig/1745841/smedevaenget_39_marbjerg_2640_hedehusene",
    164: "https://www.boliga.dk/bolig/1758399/sofiehaven_1_st_th_2600_glostrup",
    165: "https://www.boliga.dk/bolig/1755576/stadionvej_43_2_50_2600_glostrup",
    166: "https://www.boliga.dk/bolig/1741051/storegaardsvej_3_2_tv_2700_broenshoej",
    167: "https://www.boliga.dk/bolig/1750046/sydvestvej_4_2630_taastrup",
    168: "https://www.boliga.dk/bolig/1740131/soeborg_hovedgade_10a_st_2870_dyssegaard_",
    169: "https://www.boliga.dk/bolig/1737260/soeborg_hovedgade_171_st_mf_2860_soeborg",
    170: "https://www.boliga.dk/bolig/1739079/soeborg_hovedgade_199_2_4_2860_soeborg",
    171: "https://www.boliga.dk/bolig/1751530/soeholtparken_37_2660_broendby_strand",
    172: "https://www.boliga.dk/bolig/1753501/soeholtparken_90_2660_broendby_strand",
    173: "https://www.boliga.dk/bolig/1749021/soelvgade_85b_3_th_1307_koebenhavn_k",
    174: "https://www.boliga.dk/bolig/1759932/soendertoften_7_2630_taastrup",
    175: "https://www.boliga.dk/bolig/1743770/taastrup_have_24_2_th_2630_taastrup",
    176: "https://www.boliga.dk/bolig/1761593/taastrup_vaenge_41__1_1_2630_taastrup",
    177: "https://www.boliga.dk/bolig/1753629/taastrup_vaenge_55_1_th_2630_taastrup",
    178: "https://www.boliga.dk/bolig/1743847/teglvaenget_13_2630_taastrup",
    179: "https://www.boliga.dk/bolig/1717870/tinghoejvej_4__st_tv_2860_soeborg",
    180: "https://www.boliga.dk/bolig/1754785/tinghoejvej_42__2_1_2860_soeborg",
    181: "https://www.boliga.dk/bolig/1687858/tingstenen_4_2640_hedehusene",
    182: "https://www.boliga.dk/bolig/1742288/tingvej_1_vindinge_4000_roskilde",
    183: "https://www.boliga.dk/bolig/1706816/tingvej_37_4000_roskilde",
    184: "https://www.boliga.dk/bolig/1748087/topperne_11__2_23_2620_albertslund",
    185: "https://www.boliga.dk/bolig/1716600/topperne_30_2_23_2620_albertslund",
    186: "https://www.boliga.dk/bolig/1749790/topperne_32_3_doerlejl_31_2620_albertslund",
    187: "https://www.boliga.dk/bolig/1749791/topperne_6_2_doerlejl_23_2620_albertslund",
    188: "https://www.boliga.dk/bolig/1756708/topperne_7_3_31_2620_albertslund",
    189: "https://www.boliga.dk/bolig/1730274/topperne_9_st__nr_1_2620_albertslund",
    190: "https://www.boliga.dk/bolig/1762083/tranedalen_23_2635_ishoej",
    191: "https://www.boliga.dk/bolig/1749523/tranegilde_bygade_32_2635_ishoej",
    192: "https://www.boliga.dk/bolig/1760023/tvaervej_26_st_th_2640_hedehusene",
    193: "https://www.boliga.dk/bolig/1754556/ulrik_birchs_alle_58_1_tv_2300_koebenhavn_s",
    194: "https://www.boliga.dk/bolig/1760436/urtehaven_6a_1_tv_2500_valby",
    195: "https://www.boliga.dk/bolig/1724762/urtehaven_6a_2_tv_2500_valby",
    196: "https://www.boliga.dk/bolig/1726002/vadsbyvej_15_2640_hedehusene",
    197: "https://www.boliga.dk/bolig/1707988/valby_langgade_186_1_th_2500_valby",
    198: "https://www.boliga.dk/bolig/1747328/vanloese_alle_34__st_th_2720_vanloese",
    199: "https://www.boliga.dk/bolig/1756583/vedbendvej_2a_1_th_2900_hellerup",
    200: "https://www.boliga.dk/bolig/1756378/vejlebrovej_100b_2635_ishoej",
    201: "https://www.boliga.dk/bolig/1761285/vejlebrovej_102_3_th_2635_ishoej",
    202: "https://www.boliga.dk/bolig/1688569/vejlebrovej_106_st_2635_ishoej",
    203: "https://www.boliga.dk/bolig/1725765/vejlebrovej_62_2_tv_2635_ishoej",
    204: "https://www.boliga.dk/bolig/1736366/vejlebrovej_74_1_4_2635_ishoej",
    205: "https://www.boliga.dk/bolig/1733442/vejlebrovej_79__2_230_2635_ishoej",
    206: "https://www.boliga.dk/bolig/1741972/vejlebrovej_8b_2635_ishoej",
    207: "https://www.boliga.dk/bolig/1746113/vejlebrovej_94_1_doerlejl_1_2635_ishoej",
    208: "https://www.boliga.dk/bolig/1752993/vejledalen_62_2_tv_2635_ishoej",
    209: "https://www.boliga.dk/bolig/1755806/vejledalen_62_1_tv_2635_ishoej",
    210: "https://www.boliga.dk/bolig/1751219/vejledalen_64_1_th_2635_ishoej",
    211: "https://www.boliga.dk/bolig/1730710/vejlegaardsparken_12_2_doerlejl_27_2665_vallensbaek_strand",
    212: "https://www.boliga.dk/bolig/1754647/vejlegaardsparken_24_2_doerlejl_28_28_2665_vallensbaek_strand",
    213: "https://www.boliga.dk/bolig/1733365/vejlegaardsparken_52_1_15_2665_vallensbaek_strand",
    214: "https://www.boliga.dk/bolig/1749755/venedigvej_2_st_2_2300_koebenhavn_s",
    215: "https://www.boliga.dk/bolig/1716065/vesterkoeb_1_1_tv_2640_hedehusene",
    216: "https://www.boliga.dk/bolig/1699571/vesterkoeb_14_2640_hedehusene",
    217: "https://www.boliga.dk/bolig/1709222/vigerslevvej_309_2_th_2500_valby",
    218: "https://www.boliga.dk/bolig/1738433/vildtbaneparken_87_2635_ishoej",
    219: "https://www.boliga.dk/bolig/1747090/aafloejen_12_st_th_2700_broenshoej",
    220: "https://www.boliga.dk/bolig/1747216/aafloejen_16_st_th_2700_broenshoej",
    221: "https://www.boliga.dk/bolig/1761452/aafloejen_36_1_tv_2700_broenshoej",
    222: "https://www.boliga.dk/bolig/1756786/aafloejen_44_1_th_2700_broenshoej",
    223: "https://www.boliga.dk/bolig/1746762/aafloejen_50_1_tv_2700_broenshoej",
    224: "https://www.boliga.dk/bolig/1752111/oestervej_39__2_tv_2600_glostrup",
    225: "https://www.boliga.dk/bolig/1754509/oestervej_7b_tv_2750_ballerup"
}



const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
async function httpGetAsync(theUrl,type, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    if (type != null){xmlHttp.responseType = type}
    xmlHttp.send(null);
}

function httpGetSync(url){
    var request = new XMLHttpRequest();
    request.open('GET', url, false);  // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
        return request.responseText
    }
}

async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

async function start(){
    var res = {boliger:[]}
    console.log(test.length)
    for (let i = 0; i < Object.keys(test).length; i++) {
        if (test[i] == ""){
            continue;
        }
        $ = cheerio.load(httpGetSync(test[i]))
        var bolig = {
            details:[],
            discount: 0,
            images:[]
        }
        bolig.title = $('span.d-sm-inline-block').text()
        bolig.address = $('div:nth-of-type(3) span.text-muted').text()
        $('.d-flex .d-flex span.d-none').each(function(e){
            bolig.details.push($(this).text())
        })
        if ($('.mr-2 span.badge').length != 0){
            bolig.discount = $('.mr-2 span.badge').text()
        }
        bolig.sellerLink = $('a.d-flex.btn').attr('href')
        bolig.price = $('span.h4').text()
        bolig.pricem2 = $('span.d-block:nth-of-type(2)').text()
        bolig.udbetaling = $('span.d-block:nth-of-type(1)').text()
        bolig.timeOnMarket = $('.col-md-6 span.text-primary').text()
        bolig.images.push($('.slide-container div').css('background-image').replaceAll('url(','').replaceAll(')',''))
        res.boliger.push(bolig)
        console.log(JSON.stringify(bolig))
        await wait(2000)
    }
    console.log(JSON.stringify(res))
}
start()
