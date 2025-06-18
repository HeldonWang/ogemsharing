# OGEM Project Presentation Script
## Oncology Generic Efficacy Macro System

### Slide 1: Title Slide
Hello everyone. I'm Han, from China Onco programming team, and today I will introduce efficacy table part of our O-GEM project. Here is the core members of O-GEM project. As you all know nearly 70% safety outputs has been covered by O-GEM. It has saved lots of resource for China onco programming team.Therefore, improving the efficacy part will further help programmers save time.
Before we walk through the efficacy tables macros, let me briefly recapture the safety part and basic working flow of O-GEM. As you can see,

### Slide 2: Overview of TLF Process
Before we use the macros, we need first to setup the environment. Need to copy all the contents of the macros to the study folder, and update the localsetup file so that we could call all the ogem macros. And then, we need to set up m_u_popn. This is for dummy all the group header we need in the table and calculate the related patient numbers. The next document we need is sth like TLF trackers. This can be obtained directly from MOSAIC and we have a code for it to be transfered to titles sas dataset. It will be used to get titles and footnotes of the outputs. After all these staff is ready. We could call the display macro the generate related outputs. 

### Slide 3: OncoCore Efficacy Tables
Alright, let me first walk you through the core efficacy tables, which are the foundation and main targets of our analysis macros.

We’ve categorized the efficacy tables into four groups based on their statistical characteristics:

1. **Kaplan-Meier related tables (CAM-related):**  
   These include survival analysis tables, with the most common example being the PFS (Progression-Free Survival) summary table.

2. **Ratio-related tables:**  
   These cover tables that report proportions or response rates, such as objective response rate (ORR).

3. **Time-to-event related tables:**  
   This group includes endpoints like time to subsequent therapy, time to discontinuation, and time to death.

4. **Other tables:**  
   For example, the best overall response and duration of response. These share some similarities with both KM-related and ratio-related tables but are handled slightly differently.

### Slide 4: OGEM Efficacy Macros
Now, compared to the safety tables, the efficacy tables are usually more complex and more flexible, since different studies may have different endpoints, comparison strategies, and statistical methods.

To balance simplicity and flexibility, we designed two approaches for generating these tables:

For standard outputs, the user can simply use the display macro directly. This makes it very easy and efficient to produce standard tables that follow the predefined formats.

For more complex situations, where more customization or additional logic is needed, we encourage users to utilize a set of utility macros. These utility macros provide greater flexibility to handle complex conditions and specific study requirements.

Thanks to the design structure of our macros — where the display macro is built upon the utility macros, supportive macros, and analysis macros — users can easily switch between these two methods depending on their needs. This layered structure makes both simple and complex table generation much more manageable.

### Slide 5: OGEM Code Demo
Now let’s take a look at how the two methods work in practice.

On the left side, we have an example using the display macro for generating a standard output.
Here, for example, we are calling the display macro for the PFS summary table. This macro integrates all the necessary functions and internally calls the relevant analysis macros, so the user only needs to provide minimal input. The entire table can be produced with just this single macro call.
On the right side, we see an example using the utility macros directly to build the same PFS summary table step by step.
We have m_u_popn to handle the header section,
EFFCOUNT for frequency counts, KM for survival median and cox_logrank for hazard ratio and p-value calculation.
By providing both methods — the display macro for simplicity, and the utility macros for flexibility — our macro system allows users to achieve both accurate, flexible, and consistent analysis outputs, depending on the complexity of their needs. One more thing, you can see the length of the code and comprehension of the code are quite similar. So they are both easy to understand and maintain.


### Slides 6-8: AZTONCEF04 Examples
Now let’s take a closer look at how it works. Like I mentioned, the display macro for the 04 PFS summary table is basically built by combining several utility macros — u_km, u_effcount, and u_cox_log — and their names are quite straightforward.
Different utility macros are used for different parts of the table.

Here is a example of the 04 shell and related code. On the left you can see the table shell which defines the layout of the output, and on the right is how the display macro works behind the scenes. When setting up the display macro, we first provide some basic information, like the input dataset, population flag, treatment group variables, and the endpoint variable. Then, each part of the macro takes care of different sections of the table: u_effcount calculates the frequencies for different conditions, u_cox_log performs the comparison between treatment groups and calculates hazard ratios and p-values, and u_km handles the survival analysis, like the median PFS, quartiles, and survival rates at specific timepoints. At the end, we also include the reporting macro index to make sure the final output follows the standard format. So with this structure, the user only needs to input minimal information, and the display macro automatically pulls everything together to generate a complete, accurate, and standardized PFS summary table.

And then we have the open code template, which is designed to handle more flexible situations. For example, as you can see in the last two sections of the table, there’s a description part and an additional frequency calculation. In the display macro, it’s not so easy to run multiple frequency calculations unless we modify the code inside the macro. But with the open code approach, we can handle this very easily. We simply add another call to effcount at the end of the macro, combine all the analysis datasets together, and we get exactly the dataset we need. We can also call multiple analysis macros, or even call the same macro multiple times with different parameters to generate similar outputs for different conditions, and in the end, we can easily produce multiple tables as needed.


### Slides 9-11: AZTONCEF02 Examples
Another core table that’s built on core utility macros is EF02, which is for response rate related tables. Similar to what we just saw with the PFS summary table, the display macro is also made up of three main utility macros. One is binom_cp_grp, another is binom_adjrate, which handles adjusted rate, and the most complicated binom_odds, which takes care of odds ratios and related statistics. Just like before, each part takes care of its own section in the table: some handle the frequency counts, some handle relative risk estimation, and some handle the comparisons between groups. So basically, the structure is very similar — the display macro coordinates all these utility macros behind the scenes to produce a complete response rate summary table automatically.

So inside display macro, we have a few main parts: first, the basic information setup, then the response rate and adjusted rate calculation, and also the confidence interval calculation, which is controlled by the CI index parameter. For odds ratios, we have an odds option to decide whether we want to include the odds ratio or not. For other statistics like relative risk and risk difference, we can use the CMH option to control whether to calculate them. And for all these calculations, we can easily customize things like the alpha level, the number of decimal places for p-values, whether it's one-sided or two-sided p-values, and also the decimal places for confidence intervals. So overall, the macro is quite flexible and allows users to adjust most of the key statistical settings as needed.

The response rate related tables are more flexible, so the open code template is more suitable for this kind of table. We can easily add more calculations, like the relative risk, risk difference and also remove some of the calculations if we don’t need them. For example sometimes we may need two different confidence intervals. This is very hard for display macro.
For the binom_cp_grp and adjust rate part, it quite easy to understand with command parameter. And for binom_odds, since odds ratio, relative risk, and risk difference are all related to comparisons between different groups, we combined them into one utility macro. So inside binom_odds, you can control whether you want to calculate relative risk or risk difference, and you can also set options for the confidence limit type, how to handle missing values, and even customize the wording for missing values. And when we have more than two treatment groups, we can only do pairwise comparisons between two groups at a time, so we need to call m_u_binom_odds multiple times, once for each pairwise comparison.

### Slide 12: OGEM Benefits
So I won’t spend too much time talking about the obvious benefits here, because as you can see, our efficacy macros are quite straightforward, both for the display macros and the utility macros. Of course, they save a lot of programming time since there’s much less coding required, and at the same time, with these consistent macros, we can make sure all the outputs follow the same format and the same calculation method across different studies.


### Slide 13: Future Plans
Of course, we still have a long way to go. We need to continue developing macros for figures and listings in the efficacy part. We also need more trials or testing to further verify and ensure the robustness of our macros under different scenarios. And recently, we just released OGEM version 2, which now includes not only  advanced safety modules but also efficacy tables. So overall, it's still evolving and getting more complete.

### Q&A Session
I'm happy to answer any questions you might have about:

---

## Presentation Tips
1. **Technical Content**
   - Use specific examples
   - Provide real-world applications
   - Show before/after comparisons
   - Highlight key metrics

2. **Delivery Style**
   - Maintain professional tone
   - Use clear, concise language
   - Engage with the audience
   - Use visual aids effectively

3. **Key Points to Emphasize**
   - Time savings
   - Error reduction
   - Consistency improvements
   - Quality enhancements
   - Future potential

4. **Audience Engagement**
   - Ask questions
   - Share success stories
   - Show real examples
   - Encourage discussion

5. **Visual Aids**
   - Use clear graphics
   - Include relevant charts
   - Show before/after comparisons
   - Highlight key metrics

6. **Time Management**
   - Allocate time for each section
   - Leave room for questions
   - Plan for technical issues
   - Include breaks if needed

7. **Follow-up**
   - Provide contact information
   - Share documentation
   - Offer additional resources
   - Schedule follow-up meetings 