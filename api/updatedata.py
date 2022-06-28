from http.server import BaseHTTPRequestHandler
import re
import os
from collections import Counter
import math
import json
import simplejson
from unidecode import unidecode
from storage3 import create_client
from supabase import create_client as supa_create_client, Client
import tempfile
import time
import csv


class JobTitleMatch:
    """
    Matches user input of jobtitles for relevancy with the criteria outlined in their brief.
    """
    
    def __init__(self, jobtitles = [], kw = [], exclude_kw = [], sen = [], exclude_sen = [], jt = [], exclude_jt = []):
        self.jobtitles = jobtitles #jobtitles uploaded by user in list format
        self.kw = kw #relevant keywords from the brief in list format
        self.exclude_kw = exclude_kw #exclusion keywords from the brief in list format
        self.sen = sen #relevant seniorities from the brief in list format
        self.exclude_sen = exclude_sen #exclusion seniorities from the brief in list format
        self.jt = jt #relevant jobtitles from the brief in list format
        self.exclude_jt = exclude_jt #exclusion jobtitles from the brief in list format
        
        #same as above but without punctuation, lowercase, and with english characters
        self.jobtitles_clean = [unidecode(re.sub(r"[^\w\s]", "", j)).lower().strip().replace("  ", " ") for j in jobtitles]
        self.kw_clean = [unidecode(re.sub(r"[^\w\s]", "", j)).lower().strip().replace("  ", " ")  for j in kw]
        self.exclude_kw_clean = [unidecode(re.sub(r"[^\w\s]", "", j)).lower().strip().replace("  ", " ")  for j in exclude_kw]
        self.sen_clean = [unidecode(re.sub(r"[^\w\s]", "", j)).lower().strip().replace("  ", " ")  for j in sen]
        self.exclude_sen_clean = [unidecode(re.sub(r"[^\w\s]", "", j)).lower().strip().replace("  ", " ")  for j in exclude_sen]
        self.jt_clean = [unidecode(re.sub(r"[^\w\s]", "", j)).lower().strip().replace("  ", " ")  for j in jt]
        self.exclude_jt_clean = [unidecode(re.sub(r"[^\w\s]", "", j)).lower().strip().replace("  ", " ")  for j in exclude_jt]
        
        #self.exclude_jt_clean = [unidecode(re.sub(r'[\W_]+ |(/)', " ", j)).lower().strip() for j in exclude_jt]
    
    def remove_filler_words_from_jts(self):
        
        filler_words = ['a', 'an', 'and', 'at', 'do', 'has', 'in', 'of', 'the', 'to', 'my']
        additional_words = ['afghanistan', 'africa', 'aland islands', 'albania', 'algeria', 'america', 'american', 'american samoa', 'americas', 'andorra', 'angola', 'anguilla', 'antarctica', 'antigua and barbuda', 'apac', 'area', 'argentina', 'armenia', 'aruba', 'asia', 'australia', 'austria', 'azerbaijan', 'bahamas', 'bahrain', 'bangladesh', 'barbados', 'belarus', 'belgium', 'belize', 'benelux', 'benin', 'bermuda', 'bhutan', 'big', 'bolivia', 'bosnia and herzegovina', 'botswana', 'bouvet island', 'brazil', 'british indian ocean territory', 'brunei darussalam', 'bulgaria', 'burkina faso', 'burundi', 'cabo verde', 'cambodia', 'cameroon', 'canada', 'caribbean', 'cayman islands', 'central', 'central african republic', 'chad', 'chile', 'china', 'christmas island', 'coast', 'colombia', 'comoros', 'company', 'congo', 'cook islands', 'costa rica', 'cote divoire', 'country', 'croatia', 'cuba', 'curaçao', 'cyprus', 'czechia', 'denmark', 'division', 'divisional', 'djibouti', 'dominica', 'dominican republic', 'east', 'eastern', 'ecuador', 'egypt', 'el salvador', 'emea', 'equatorial guinea', 'eritrea', 'estonia', 'eswatini', 'ethiopia', 'eu', 'europe', 'european', 'exec', 'executive', 'falkland islands', 'faroe islands', 'fiji', 'finland', 'france', 'french guiana', 'french polynesia', 'french southern territories', 'functional', 'gabon', 'gambia', 'georgia', 'germany', 'ghana', 'gibraltar', 'global', 'greece', 'greenland', 'grenada', 'group', 'guadeloupe', 'guam', 'guatemala', 'guernsey', 'guinea', 'guinea-bissau', 'guyana', 'haiti', 'heard island and mcdonald islands', 'honduras', 'hong kong', 'hungary', 'iceland', 'india', 'indonesia', 'innovation', 'institutional', 'interim', 'internation', 'international', 'iran', 'iraq', 'ireland', 'isle of man', 'israel', 'italy', 'jamaica', 'japan', 'jersey', 'jordan', 'kazakhstan', 'kenya', 'kingdom', 'kiribati', 'korea', 'kuwait', 'kyrgyzstan', 'latam', 'latin', 'latvia', 'lebanon', 'lesotho', 'liberia', 'libya', 'liechtenstein', 'lithuania', 'local', 'london', 'luxembourg', 'macao', 'madagascar', 'malawi', 'malaysia', 'maldives', 'mali', 'malta', 'marshall islands', 'martinique', 'mauritania', 'mauritius', 'mayotte', 'mexico', 'middle', 'moldova', 'monaco', 'mongolia', 'montenegro', 'montserrat', 'morocco', 'mozambique', 'myanmar', 'namibia', 'national', 'nauru', 'nepal', 'netherlands', 'new caledonia', 'new zealand', 'nicaragua', 'niger', 'nigeria', 'niue', 'nordic', 'nordics', 'norfolk island', 'north', 'northeast', 'northern', 'northern mariana islands', 'norway', 'oman', 'pacific', 'pakistan', 'palau', 'palestine', 'panama', 'papua new guinea', 'paraguay', 'peru', 'philippines', 'pitcairn', 'poland', 'portugal', 'principal', 'puerto rico', 'qatar', 'region', 'regional', 'regions', 'republic of north macedonia', 'romania', 'russia', 'russian federation', 'rwanda', 'saint barthelemy', 'saint helena', 'saint kitts and nevis', 'saint lucia', 'saint martin', 'saint pierre and miquelon', 'saint vincent and the grenadines', 'samoa', 'san marino', 'sao tome and principe', 'saudi arabia', 'section', 'senegal', 'senior', 'serbia', 'seychelles', 'sierra leone', 'singapore', 'sint maarten', 'slovakia', 'slovenia', 'snr', 'solomon islands', 'somalia', 'south', 'south africa', 'south georgia and the south sandwich islands', 'south sudan', 'southeast', 'spain', 'sr', 'sri lanka', 'states', 'sudan', 'suriname', 'svalbard and jan mayen', 'sweden', 'switzerland', 'syrian arab republic', 'taiwan', 'tajikistan', 'tanzania', 'thailand', 'timor-leste', 'togo', 'tokelau', 'tonga', 'transformation', 'trinidad and tobago', 'tunisia', 'turkey', 'turkmenistan', 'turks and caicos islands', 'tuvalu', 'uganda', 'uk', 'uki', 'ukraine', 'united', 'united arab emirates', 'united kingdom of great britain and northern ireland', 'united states minor outlying islands', 'united states of america', 'uruguay', 'us', 'usa', 'uzbekistan', 'vanuatu', 'venezuela', 'viet nam', 'virgin islands', 'wallis and futuna', 'west', 'western sahara', 'worldwide', 'yemen', 'zambia']
        
        #Want to make sure that none of the words are excluded or relevant
        all_words = self.kw_clean + self.exclude_kw_clean + self.sen_clean + self.exclude_sen_clean + self.jt_clean + self.exclude_jt_clean
        additional_words = list(set(additional_words) - set(all_words))
        
        #Additional removal of singular words that are relevant or excluded
        all_words = ' '.join(all_words)
        all_words = all_words.split(' ')
        additional_words = list(set(additional_words) - set(all_words))
            
        cleaned_titles = []
        
        for i in self.jobtitles_clean: #remove filler and additional words from user's jobtitles
            cleaned_titles.append(' '.join([j for j in i.split(' ') if j not in filler_words + additional_words]))
        
        self.jobtitles_clean = cleaned_titles
        
        cleaned_titles = []
        
        for i in self.jt_clean: #remove filler words from jobtitles in brief
            cleaned_titles.append(' '.join([j for j in i.split(' ') if j not in filler_words]))
        
        self.jt_clean = cleaned_titles
        
        cleaned_titles = []
        
        for i in self.exclude_jt_clean: #remove filler words from exclusion jobtitles in brief
            cleaned_titles.append(' '.join([j for j in i.split(' ') if j not in filler_words]))
        
        self.exclude_jt_clean = cleaned_titles
        
    def add_extra_titles(self):
        
        extra_kw = [
            ['it','information technology', 'ict'],
            ['technology', 'tech', 'technical'],
            ['information', 'info'],
            ['hr', 'human resources'],
            ['esg', 'environmental social and governance'],
            ['sdg', 'sustainable development goals'],
            ['application', 'app'],
            ['cyber security', 'cybersecurity'],
            ['finance', 'financial']
            ]
        
        extra_sen = [
            ['manager', 'mgr'],
            ['svp','senior vice president', 'sr vp', 'sr vice president', 'snr vp', 'snr vice president', 'senior vp'],
            ['vp','vice president']
            ]
        
        def check(lst, include, exclude):
            
            for i in lst:
                for j in i:
                    if j in include:
                        include.extend([k for k in i if k not in include and k not in exclude])
                        break
                            
            return include
        
        self.kw_clean = check(extra_kw, self.kw_clean, self.exclude_kw_clean)
        self.sen_clean = check(extra_sen, self.sen_clean, self.exclude_sen_clean)
        self.kw_clean.extend([f'{i}s' for i in self.kw_clean if f'{i}s' not in self.kw_clean and i[-1] != 's'])
        self.kw_clean.extend([i[:-1] for i in self.kw_clean if i[:-1] not in self.kw_clean and i[-1] == 's'])
        
        self.exclude_kw_clean = check(extra_kw, self.exclude_kw_clean, self.kw_clean)
        self.exclude_sen_clean = check(extra_sen, self.exclude_sen_clean, self.sen_clean)
        self.exclude_kw_clean.extend([f'{i}s' for i in self.exclude_kw_clean if f'{i}s' not in self.exclude_kw_clean and i[-1] != 's'])
        self.exclude_kw_clean.extend([i[:-1] for i in self.exclude_kw_clean if i[:-1] not in self.exclude_kw_clean and i[-1] == 's'])
                        
    def get_cosine(self, vec1, vec2):
        intersection = set(vec1.keys()) & set(vec2.keys())
        numerator = sum([vec1[x] * vec2[x] for x in intersection])
    
        sum1 = sum([vec1[x] ** 2 for x in list(vec1.keys())])
        sum2 = sum([vec2[x] ** 2 for x in list(vec2.keys())])
        denominator = math.sqrt(sum1) * math.sqrt(sum2)
    
        if not denominator:
            return 0.0
        else:
            return float(numerator) / denominator

    def text_to_vector(self, text):
        WORD = re.compile(r"\w+")
        words = WORD.findall(text)
        return Counter(words)
    
    def check_percentage_match(self):
        
        report = {}
        report_counts = {'High':0, 'Medium':0, 'Low':0}
        
        #exclude = self.exclude_kw_clean + self.exclude_sen_clean + self.exclude_jt_clean
        exclude = self.exclude_kw_clean + self.exclude_sen_clean
        
        for index, jt in enumerate(self.jobtitles_clean):
            
            high_perc = 0.00
            
            if self.sen_clean != [] or self.kw_clean != []:
                if self.sen_clean == [] and self.kw_clean != []:
                    for i in self.kw_clean:
                        word_or_plural = re.escape(i) + 's?'
                        if re.search(rf'\b{i}\b', jt) or re.match(word_or_plural, jt):
                            high_perc = 0.99
                            break
                else:
                    #Then check for matching with seniorities and keywords paired:
                    for i in self.sen_clean:
                        if re.search(rf'\b{i}\b', jt):
                            if i == 'director' and 'associate director' not in self.sen_clean and ('assoc' in jt or 'associate' in jt):
                                continue
                            if self.sen_clean != [] and self.kw_clean == []:
                                high_perc = 0.99
                                break
                            for j in self.kw_clean:
                                if re.search(rf'\b{j}\b', jt):
                                    keywords = []
                                    for k in self.kw_clean:
                                        
                                        try:
                                            if re.search(rf'\b{i} {j}\b', jt).start() == 0:
                                                high_perc = 0.99
                                        except:
                                            try:
                                                if re.search(rf'\b{j} {i}\b', jt).start() == 0:
                                                    high_perc = 0.99
                                            except:
                                                pass
                                            
                                        if k == j:
                                            vector1 = self.text_to_vector(jt)
                                            vector2 = self.text_to_vector(f'{i} {j}')
                                            cosine = round(self.get_cosine(vector1, vector2),2)    
                                                
                                        else:
                                            keywords.append(k)
                                            vector1 = self.text_to_vector(jt)
                                            vector2 = self.text_to_vector(f'{i} {j} {" ".join(keywords)}')
                                            cosine = round(self.get_cosine(vector1, vector2),2)   
                                            
                                        if cosine == 1.00:
                                            #check to make sure that if an additional word is in the original jobtitle, it is not a clean match
                                            additional_words = ['afghanistan', 'africa', 'aland islands', 'albania', 'algeria', 'america', 'american', 'american samoa', 'americas', 'andorra', 'angola', 'anguilla', 'antarctica', 'antigua and barbuda', 'apac', 'area', 'argentina', 'armenia', 'aruba', 'asia', 'australia', 'austria', 'azerbaijan', 'bahamas', 'bahrain', 'bangladesh', 'barbados', 'belarus', 'belgium', 'belize', 'benelux', 'benin', 'bermuda', 'bhutan', 'big', 'bolivia', 'bosnia and herzegovina', 'botswana', 'bouvet island', 'brazil', 'british indian ocean territory', 'brunei darussalam', 'bulgaria', 'burkina faso', 'burundi', 'cabo verde', 'cambodia', 'cameroon', 'canada', 'caribbean', 'cayman islands', 'central', 'central african republic', 'chad', 'chile', 'china', 'christmas island', 'coast', 'colombia', 'comoros', 'company', 'congo', 'cook islands', 'costa rica', 'cote divoire', 'country', 'croatia', 'cuba', 'curaçao', 'cyprus', 'czechia', 'denmark', 'division', 'divisional', 'djibouti', 'dominica', 'dominican republic', 'east', 'eastern', 'ecuador', 'egypt', 'el salvador', 'emea', 'equatorial guinea', 'eritrea', 'estonia', 'eswatini', 'ethiopia', 'eu', 'europe', 'european', 'exec', 'executive', 'falkland islands', 'faroe islands', 'fiji', 'finland', 'france', 'french guiana', 'french polynesia', 'french southern territories', 'functional', 'gabon', 'gambia', 'georgia', 'germany', 'ghana', 'gibraltar', 'global', 'greece', 'greenland', 'grenada', 'group', 'guadeloupe', 'guam', 'guatemala', 'guernsey', 'guinea', 'guinea-bissau', 'guyana', 'haiti', 'heard island and mcdonald islands', 'honduras', 'hong kong', 'hungary', 'iceland', 'india', 'indonesia', 'innovation', 'institutional', 'interim', 'internation', 'international', 'iran', 'iraq', 'ireland', 'isle of man', 'israel', 'italy', 'jamaica', 'japan', 'jersey', 'jordan', 'kazakhstan', 'kenya', 'kingdom', 'kiribati', 'korea', 'kuwait', 'kyrgyzstan', 'latam', 'latin', 'latvia', 'lebanon', 'lesotho', 'liberia', 'libya', 'liechtenstein', 'lithuania', 'local', 'london', 'luxembourg', 'macao', 'madagascar', 'malawi', 'malaysia', 'maldives', 'mali', 'malta', 'marshall islands', 'martinique', 'mauritania', 'mauritius', 'mayotte', 'mexico', 'middle', 'moldova', 'monaco', 'mongolia', 'montenegro', 'montserrat', 'morocco', 'mozambique', 'myanmar', 'namibia', 'national', 'nauru', 'nepal', 'netherlands', 'new caledonia', 'new zealand', 'nicaragua', 'niger', 'nigeria', 'niue', 'nordic', 'nordics', 'norfolk island', 'north', 'northeast', 'northern', 'northern mariana islands', 'norway', 'oman', 'pacific', 'pakistan', 'palau', 'palestine', 'panama', 'papua new guinea', 'paraguay', 'peru', 'philippines', 'pitcairn', 'poland', 'portugal', 'principal', 'puerto rico', 'qatar', 'region', 'regional', 'regions', 'republic of north macedonia', 'romania', 'russia', 'russian federation', 'rwanda', 'saint barthelemy', 'saint helena', 'saint kitts and nevis', 'saint lucia', 'saint martin', 'saint pierre and miquelon', 'saint vincent and the grenadines', 'samoa', 'san marino', 'sao tome and principe', 'saudi arabia', 'section', 'senegal', 'senior', 'serbia', 'seychelles', 'sierra leone', 'singapore', 'sint maarten', 'slovakia', 'slovenia', 'snr', 'solomon islands', 'somalia', 'south', 'south africa', 'south georgia and the south sandwich islands', 'south sudan', 'southeast', 'spain', 'sr', 'sri lanka', 'states', 'sudan', 'suriname', 'svalbard and jan mayen', 'sweden', 'switzerland', 'syrian arab republic', 'taiwan', 'tajikistan', 'tanzania', 'thailand', 'timor-leste', 'togo', 'tokelau', 'tonga', 'transformation', 'trinidad and tobago', 'tunisia', 'turkey', 'turkmenistan', 'turks and caicos islands', 'tuvalu', 'uganda', 'uk', 'uki', 'ukraine', 'united', 'united arab emirates', 'united kingdom of great britain and northern ireland', 'united states minor outlying islands', 'united states of america', 'uruguay', 'us', 'usa', 'uzbekistan', 'vanuatu', 'venezuela', 'viet nam', 'virgin islands', 'wallis and futuna', 'west', 'western sahara', 'worldwide', 'yemen', 'zambia']
                                            
                                            for l in additional_words:
                                                if re.search(rf'\b{l}\b', self.jobtitles[self.jobtitles_clean.index(jt)]):
                                                    #unless additional word is in targets
                                                    if re.search(rf'\b{l}\b', i):
                                                        continue
                                                    elif re.search(rf'\b{l}\b', j):
                                                        continue
                                                    cosine = 0.99
                                                
                                            high_perc = cosine
                                            break
                                        
                                        if cosine > high_perc:
                                            high_perc = cosine
                                    
                            if high_perc == 1.00:
                                break
                        
            #Exact titles:
            if self.jt_clean != []:
                for i in self.jt_clean:
                    check = False
                    try:
                        if re.search(rf'\b{i}\b', jt).start() == 0:
                            high_perc = 0.99
                    except:
                        check_words = ['associate', 'assoc', 'global head', 'group head', 'general manager']
                        check = False
                        
                        for j in check_words:
                            if re.search(rf'\b{j}\b', jt) and re.search(rf'\b{j}\b', i):
                                continue
                            else:
                                high_perc = 0.00
                                check = True
                                break
                    
                    if check == False:
                        vector1 = self.text_to_vector(jt)
                        vector2 = self.text_to_vector(i)
                        cosine = round(self.get_cosine(vector1, vector2),2)
                        
                        if cosine == 1.00:
                            additional_words = ['afghanistan', 'africa', 'aland islands', 'albania', 'algeria', 'america', 'american', 'american samoa', 'americas', 'andorra', 'angola', 'anguilla', 'antarctica', 'antigua and barbuda', 'apac', 'area', 'argentina', 'armenia', 'aruba', 'asia', 'australia', 'austria', 'azerbaijan', 'bahamas', 'bahrain', 'bangladesh', 'barbados', 'belarus', 'belgium', 'belize', 'benelux', 'benin', 'bermuda', 'bhutan', 'big', 'bolivia', 'bosnia and herzegovina', 'botswana', 'bouvet island', 'brazil', 'british indian ocean territory', 'brunei darussalam', 'bulgaria', 'burkina faso', 'burundi', 'cabo verde', 'cambodia', 'cameroon', 'canada', 'caribbean', 'cayman islands', 'central', 'central african republic', 'chad', 'chile', 'china', 'christmas island', 'coast', 'colombia', 'comoros', 'company', 'congo', 'cook islands', 'costa rica', 'cote divoire', 'country', 'croatia', 'cuba', 'curaçao', 'cyprus', 'czechia', 'denmark', 'division', 'divisional', 'djibouti', 'dominica', 'dominican republic', 'east', 'eastern', 'ecuador', 'egypt', 'el salvador', 'emea', 'equatorial guinea', 'eritrea', 'estonia', 'eswatini', 'ethiopia', 'eu', 'europe', 'european', 'exec', 'executive', 'falkland islands', 'faroe islands', 'fiji', 'finland', 'france', 'french guiana', 'french polynesia', 'french southern territories', 'functional', 'gabon', 'gambia', 'georgia', 'germany', 'ghana', 'gibraltar', 'global', 'greece', 'greenland', 'grenada', 'group', 'guadeloupe', 'guam', 'guatemala', 'guernsey', 'guinea', 'guinea-bissau', 'guyana', 'haiti', 'heard island and mcdonald islands', 'honduras', 'hong kong', 'hungary', 'iceland', 'india', 'indonesia', 'innovation', 'institutional', 'interim', 'internation', 'international', 'iran', 'iraq', 'ireland', 'isle of man', 'israel', 'italy', 'jamaica', 'japan', 'jersey', 'jordan', 'kazakhstan', 'kenya', 'kingdom', 'kiribati', 'korea', 'kuwait', 'kyrgyzstan', 'latam', 'latin', 'latvia', 'lebanon', 'lesotho', 'liberia', 'libya', 'liechtenstein', 'lithuania', 'local', 'london', 'luxembourg', 'macao', 'madagascar', 'malawi', 'malaysia', 'maldives', 'mali', 'malta', 'marshall islands', 'martinique', 'mauritania', 'mauritius', 'mayotte', 'mexico', 'middle', 'moldova', 'monaco', 'mongolia', 'montenegro', 'montserrat', 'morocco', 'mozambique', 'myanmar', 'namibia', 'national', 'nauru', 'nepal', 'netherlands', 'new caledonia', 'new zealand', 'nicaragua', 'niger', 'nigeria', 'niue', 'nordic', 'nordics', 'norfolk island', 'north', 'northeast', 'northern', 'northern mariana islands', 'norway', 'oman', 'pacific', 'pakistan', 'palau', 'palestine', 'panama', 'papua new guinea', 'paraguay', 'peru', 'philippines', 'pitcairn', 'poland', 'portugal', 'principal', 'puerto rico', 'qatar', 'region', 'regional', 'regions', 'republic of north macedonia', 'romania', 'russia', 'russian federation', 'rwanda', 'saint barthelemy', 'saint helena', 'saint kitts and nevis', 'saint lucia', 'saint martin', 'saint pierre and miquelon', 'saint vincent and the grenadines', 'samoa', 'san marino', 'sao tome and principe', 'saudi arabia', 'section', 'senegal', 'senior', 'serbia', 'seychelles', 'sierra leone', 'singapore', 'sint maarten', 'slovakia', 'slovenia', 'snr', 'solomon islands', 'somalia', 'south', 'south africa', 'south georgia and the south sandwich islands', 'south sudan', 'southeast', 'spain', 'sr', 'sri lanka', 'states', 'sudan', 'suriname', 'svalbard and jan mayen', 'sweden', 'switzerland', 'syrian arab republic', 'taiwan', 'tajikistan', 'tanzania', 'thailand', 'timor-leste', 'togo', 'tokelau', 'tonga', 'transformation', 'trinidad and tobago', 'tunisia', 'turkey', 'turkmenistan', 'turks and caicos islands', 'tuvalu', 'uganda', 'uk', 'uki', 'ukraine', 'united', 'united arab emirates', 'united kingdom of great britain and northern ireland', 'united states minor outlying islands', 'united states of america', 'uruguay', 'us', 'usa', 'uzbekistan', 'vanuatu', 'venezuela', 'viet nam', 'virgin islands', 'wallis and futuna', 'west', 'western sahara', 'worldwide', 'yemen', 'zambia']
                                            
                            for t in additional_words:
                                if re.search(rf'\b{t}\b', self.jobtitles[self.jobtitles_clean.index(jt)]):
                                    if re.search(rf'\b{t}\b', self.jt[self.jobtitles_clean.index(i)]):
                                        continue
                                    cosine = 0.99
                                    
                            high_perc = cosine
                            break
                        
                        if cosine > high_perc:
                            high_perc = cosine
            
            #Exclusion checker - set to 2.00 if found:
            if high_perc != 0.00 and (exclude != [] or self.exclude_jt_clean != []):
                for i in exclude:
                    if re.search(rf'\b{i}\b', jt):
                        high_perc = 2.00
                        break
                
                if high_perc != 2.00:
                    for i in self.exclude_jt_clean:
                        vector1 = self.text_to_vector(jt)
                        vector2 = self.text_to_vector(f'{i} {j}')
                        cosine = round(self.get_cosine(vector1, vector2),2)
                        
                        if cosine != 0.00:
                            high_perc = 2.00
                            break
            
            if high_perc == 0.00:
                report[self.jobtitles[index]] = 'No match'
                report_counts['Low'] += 1
            elif high_perc == 2.00:
                report[self.jobtitles[index]] = 'Exclude'
                report_counts['Low'] += 1
            elif high_perc == 1.00:
                report[self.jobtitles[index]] = 'Clean match'
                report_counts['High'] += 1
            elif high_perc < 1.00 and high_perc >= 0.75:
                report[self.jobtitles[index]] = 'Strong match'
                report_counts['High'] += 1
            elif high_perc < 0.75 and high_perc >= 0.60:
                report[self.jobtitles[index]] = 'Medium match'
                report_counts['Medium'] += 1
            else:
                report[self.jobtitles[index]] = 'Weak match'
                report_counts['Low'] += 1
            
        return report, report_counts
    
    def hello(self):
        print(f'User jobtitles: {self.jobtitles_clean}')
        print(f'Relevant keywords: {self.kw_clean}')
        print(f'Relevant seniorities: {self.sen_clean}')
        print(f'Relevant jobtitles: {self.jt_clean}')
        print(f'Exclusion keywords: {self.exclude_kw_clean}')
        print(f'Exclusion seniorities: {self.exclude_sen_clean}')
        print(f'Exclusion jobtitles: {self.exclude_jt_clean}')
        
class CompanyMatch(JobTitleMatch):

    def __init__(self, companies = [], targets = [], exclude = []):
        self.companies = companies
        self.targets = targets
        self.exclude = exclude
        
        #same as above but without punctuation, lowercase, and with english characters
        self.companies_clean = [unidecode(re.sub(r"[^\w\s]", "", j)).lower().strip().replace("  ", " ") for j in companies]
        self.targets_clean = [unidecode(re.sub(r"[^\w\s]", "", j)).lower().strip().replace("  ", " ") for j in targets]
        self.exclude_clean = [unidecode(re.sub(r"[^\w\s]", "", j)).lower().strip().replace("  ", " ") for j in exclude]
        
    def remove_company_extensions(self):
        
        company_adds = ['uki', 'qmj', 'ohf', 's en c', 'srl', 'partg', 'sdn bhd', 'sp', 'ltd', 'snc', 'sia', 'ehf', 'ag', 'pte', 'aj', 'spp', '3at', 'gp', 'bl', 'plc ltd', 'kt', 'scoop', 'dno', 'iks', 'dooel', 'hf', 'sf', 'sprl', 'vzw', 'sgps', 'hb', 'incorporated', 'scs', 'sc', 'as oy', 'kf', 'sasu', 'ong', 'ses', 'llp', 'asa', 'adsitz', 'sll', 'nl', 'koop', 'corporation', 'gesbr', 'aat', 'at', 'cio', 'xxk', 'scpa', 'pte ltd', 'fmba', 'ovee', 'da', 'llc', 's de rl', 'kht', 'sro', 'pse', 'sab', 'zao', 'stg', 'fie', 'ep', 'fcp', 'secs', 'gte', 'peec', 'kv', 'se', 'zrt', 'ok', 'oy', 'plc', 'sagl', 'tmi', 'mb', 'tapui', 'qk', 'tdv', 'sogepa', 'kda', 'vof', 'cpt', 'esv', 'et', 'dd', 'bv', 'akc spol', 'crl', 'coop', 'kb', 'sca', 'kft', 'cvoa', 'ans', 'sem', 'scra', 'spa', 'jtd', 'od', 'ab', 'bm', 'kg', 'obrt', 'uk', 'oao', 'spk', 'ead', 'xt', 'is', 'cxa', 'sm pte ltd', 'pvt ltd', 'c por a', 'ddo', 'tov', 'fa', 'psu', 'teo', 'cic', 'ca', 'kkt', 'pp', 'ohg', 'saog', 'ultd', 'etat', 'saa', 'ltda', 'shpk', 'spj', 'ss', 'sapa', 'nuf', 'oaj', 'ae', 'eg', 'ba', 'soccol', 'asoy', 'commv', 'tmi', 'sl', 'gbr', 'kd', 'ay', 'sae', 'uab', 'nyrt', 'cv', 'saoc', '3ao', 'doo', 'sa', 'sas', 'lp', 'eirl', 'sce i', 'slne', 'mchj', 'gs', 'limited', 'fkf', 'mepe', 'company', 'sep', 'vat', 'inc', 'yoaj', 'sp zoo', 'gie', 'sd', 'sccl', 'oyj', 'ky', 'ud', 'eurl', 'ei', 'sarl', 'bhd', 'gmbh', 'pllc', 'sad', 'rt', 'ska', 'xk', 'scop', 'gmbh  co kg', 'ev', 'sal', 'and company', 'ooo', 'sicav', 'lda', 'eu', 'kgaa', 'ik', 'oe', 'ent', 'fop', 'pt', 'amba', 'ad', 'sgr', 'as', 'vos', 'epe', 'nv', 'suc de descendants', 'scrl', 'ps', 'ij', 'smba', 'bvba', 'cbva', 'zat', 'ec', 'dat', 'og', 'sapi', 'unltd', 'rhf', 'sha', 'ks', 'pty ltd', 'corp', 'a', 'an', 'and', 'at', 'do', 'has', 'in', 'of', 'the', 'to', 'my', 'bank', 'group']
        
        def clean(comps, company_adds):
            
            temp = []
            
            for i in comps:
                comp = i.split(' ')
                comp = [i for i in comp if i not in company_adds]
                temp.append(' '.join(comp))
            
            return temp
        
        self.companies_clean = clean(self.companies_clean, company_adds)
        self.targets_clean = clean(self.targets_clean, company_adds)
        self.exclude_clean = clean(self.exclude_clean, company_adds)
        
    def add_other_variations(self):
        
        #variations = {'bally':['bally manufacturing', 'bally entertainment'], 'abba seafood':['abba'], 'abc':['american broadcasting'], 'abloy':['assa abloy'], 'adobe systems':['adobe'], 'aflac':['american family life assurance columbus'], 'ahlstrom':['ahlstrom munksjo'], 'ahold':['koninklijke ahold', 'ahold delhaize'], 'akamai':['akamai technologies'], 'akzo':['akzo nobel', 'akzonobel'], 'alcatellucent':['lucent technologies'], 'alfa romeo':['alfa romeo automobiles'], 'alibaba group':['alibaba'], 'alltel wireless':['alltel'], 'amazoncom':['amazon'], 'ambev':['inbev', 'ambev', 'anheuserbusch inBev'], 'amc theatres':['amc entertainment'], 'amd':['advanced micro devices'], 'amkor':['amkor technology'], 'arp':['arp instruments'], 'artis':['natura artis magistra'], 'asda':['asda stores'], 'aston martin':['aston martin lagonda'], 'asus':['asustek computer']}
        variations = {'bank america':['bofa'], 'american express':['amex'], 'aflac':['american family life assurance columbus'], 'akzo':['akzonobel'], 'alcatellucent':['lucent technologies'], 'amazon':['amazoncom'], 'ambev':['inbev', 'anheuserbusch inBev'], 'amc theatres':['amc entertainment'], 'amd':['advanced micro devices'], 'asus':['asustek computer']}
        
        def check_for_var(comp, variations):
            
            for i in variations.keys():
                if re.search(rf'\b{i}\b', comp) or re.search(rf'\b{comp}\b', i):
                    return_list = [i]
                    return_list.extend(variations[i])
                    return return_list
                for j in variations[i]:
                    if re.search(rf'\b{j}\b', comp) or re.search(rf'\b{comp}\b', j):
                        return_list = [i]
                        return_list.extend(variations[i])
                        return return_list
                
            return False
        
        extra_targets = []
        for index, comp in enumerate(self.targets_clean):
            extra = check_for_var(comp, variations)
            if extra != False:
                extra_targets.extend([f'{i}:{self.targets[index]}' for i in extra if i not in self.targets_clean])
        
        self.targets_clean.extend(extra_targets)
                
        extra_exclude = []
        for index, comp in enumerate(self.exclude_clean):
            extra = check_for_var(comp, variations)
            if extra != False:
                extra_exclude.extend([f'{i}:{self.exclude[index]}' for i in extra if i not in self.exclude_clean])
        
        self.exclude_clean.extend(extra_exclude)
        
    def check_percentage_match(self):
        
        report = {}
        report_counts = {'High':0, 'Medium':0, 'Low':0}
        matched_companies = {}
        
        for index, comp in enumerate(self.companies_clean):
            
            high_perc = 0.00
            
            for index1, i in enumerate(self.exclude_clean):
                
                if ':' in i:
                    temp = i[:i.index(':')]
                else:
                    temp = i
                    
                if re.search(rf'\b{temp}\b', comp) or re.search(rf'\b{comp}\b', temp):
                    high_perc = 2.00
                    if ':' in i:
                        matched_companies[temp] = i[i.index(':') + 1:]
                    else:
                       matched_companies[self.companies[index]] = self.exclude[index1]
                    break
            
            if high_perc == 0.00:
                
                for index2, i in enumerate(self.targets_clean):
                    
                    if ':' in i:
                        temp = i[:i.index(':')]
                    else:
                        temp = i
                    
                    if re.search(rf'\b{temp}\b', comp) or re.search(rf'\b{comp}\b', temp):
                        pass
                    else:
                        continue
                    
                    key = ''
                    value = ''
                    
                    if temp == comp:
                        high_perc = 1.00
                        if ':' in i:
                            matched_companies[temp] = i[i.index(':') + 1:]
                        else:
                           matched_companies[self.companies[index]] = self.targets[index2]
                        break
                
                    try:
                        if re.search(rf'\b{temp}\b', comp).start() == 0:
                            cosine = 0.99
                    except:
                        try:
                            if re.search(rf'\b{comp}\b', temp).start() == 0:
                                cosine = 0.99
                        except:
                            vector1 = self.text_to_vector(comp)
                            vector2 = self.text_to_vector(temp)
                            cosine = round(self.get_cosine(vector1, vector2),2)

                    if cosine == 1.00:
                        high_perc = cosine
                        if ':' in i:
                            matched_companies[temp] = i[i.index(':') + 1:]
                        else:
                            matched_companies[self.companies[index]] = self.targets[index2]
                        break
                    
                    if cosine > high_perc:
                            
                        high_perc = cosine
                        
                        if ':' in i:
                            key = temp
                            value = i[i.index(':') + 1:]
                        else:
                            key = self.companies[index]
                            value = self.targets[index2]

            
            if key != '' and cosine != 1.00:
                matched_companies[key] = value
        
            if high_perc == 0.00:
                report[self.companies[index]] = 'No match'
                report_counts['Low'] += 1
            elif high_perc == 2.00:
                report[self.companies[index]] = 'Exclude'
                report_counts['Low'] += 1
            elif high_perc == 1.00:
                report[self.companies[index]] = 'Clean match'
                report_counts['High'] += 1
            elif high_perc < 1.00 and high_perc >= 0.70:
                report[self.companies[index]] = 'Strong match'
                report_counts['High'] += 1
            elif high_perc < 0.70 and high_perc > 0.50:
                report[self.companies[index]] = 'Medium match'
                report_counts['Medium'] += 1
            else:
                report[self.companies[index]] = 'Weak match'
                report_counts['Low'] += 1
            
        return report, report_counts, matched_companies
    
    def hello(self):
        
        print(f'User companies: {self.companies_clean}')
        print(f'Relevant companies: {self.targets_clean}')
        print(f'Exclusion companies: {self.exclude_clean}')


class handler(BaseHTTPRequestHandler):

    def do_POST(self):

        self.data_string = self.rfile.read(int(self.headers['Content-Length']))

        self.send_response(200)
        self.end_headers()

        data = simplejson.loads(self.data_string)
        print(data)
        
        try:
            test = JobTitleMatch(
                jobtitles=data["jobtitles"],
                kw=data["kw"],
                exclude_kw=data["exclude_kw"],
                sen=data["sen"],
                exclude_sen=data["exclude_sen"],
                jt=data["jt"],
                exclude_jt=data["exclude_jt"]
            )

            test.remove_filler_words_from_jts()

            test.add_extra_titles()

            a = test.check_percentage_match()

            unique_jts = len(set(data["jobtitles"]))

            test2 = CompanyMatch(
                companies=data["companies"],
                targets=data["include_companies"],
                exclude=data["exclude_companies"])

            test2.remove_company_extensions()

            test2.add_other_variations()

            b = test2.check_percentage_match()

            unique_comps = len(set(data["companies"]))

            # DB variables to login
            key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
            url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") 
            supabase: Client = supa_create_client(url, key)

            comp_report_sum = b[1]
            jt_report_sum = a[1]

            # make unique url for the file name to be stored at
            str = data["user_id"]+"/"+data["id"]+"/"+data["file_name"]+".csv"

            # update the row in the db with a completed row with results
            supabase.table("results").update(
                {   
                    "comp_high": comp_report_sum["High"],
                    "comp_medium": comp_report_sum["Medium"],
                    "comp_low": comp_report_sum["Low"],
                    "job_title_high": jt_report_sum["High"],
                    "job_title_medium": jt_report_sum["Medium"],
                    "job_title_low": jt_report_sum["Low"],
                    "job_title_unique_count": unique_jts,
                    "comp_unique_count": unique_comps,
                    "is_processing": False,
                    "row_count": 6,
                    "file": str}).eq("id", data["id"]).execute()

            # open client connection from file storage
            storage_client = create_client(url+ "/storage/v1", {"apiKey": key, "Authorization": f"Bearer {key}"}, is_async=False)

            # make temp file
            new_file, filename = tempfile.mkstemp(suffix='.csv')

            # write in temp file from the results
            jobtitle_match = [a[0][j] for j in data["jobtitles"]]
            company_match = [b[0][j] for j in data["companies"]]
            company_targets = []
            for i in data["companies"]:
                if i in b[2]:
                    company_targets.append(b[2][i])
                else:
                    company_targets.append('')

            if len(data["jobtitles"]) > len(data["companies"]) and data["jobtitles"] != [] and data["companies"] != []:
                for i in range(len(company_match), len(jobtitle_match) + 1):
                    company_match.append('')
                    company_targets.append('')
                    companies.append('')

            if data["jobtitles"] != [] and data["companies"] != []:
                headers = ['Jobtitles', 'Jobtitles group', 'Companies', 'Companies group', 'Companies match']
            elif data["jobtitles"] != [] and data["companies"] == []:
                headers = ['Jobtitles', 'Jobtitles group']
            elif data["jobtitles"] == [] and data["companies"] != []:
                headers = ['Companies', 'Companies group', 'Companies match']

            # write in temp file from the results
            with open(filename, 'w', encoding='UTF8', newline='') as csv_file:
                writer = csv.writer(csv_file)
                writer.writerow(headers)

                if data["jobtitles"] != [] and data["companies"] != []:
                    for index, i in enumerate(data["jobtitles"]):
                        writer.writerow([i, jobtitle_match[index], data["companies"][index], company_match[index], company_targets[index]])
                elif data["jobtitles"] != [] and data["companies"] == []:
                    for index, i in enumerate(data["jobtitles"]):
                        writer.writerow([i, jobtitle_match[index]])
                elif data["jobtitles"] == [] and data["companies"] != []:
                    for index, i in enumerate(data["companies"]):
                        writer.writerow([i, company_match[index], company_targets[index]])

            # store new file on the db
            storage_client.get_bucket("reports").upload(str, new_file)

            os.close(new_file)

            return
        
        except Exception as e:
            print("has error")
            print(e)
            
            supabase.table("results").update(
            { 
                "error": "failed to upload results"
            }).eq("id", data["id"]).execute()
            
            return 
